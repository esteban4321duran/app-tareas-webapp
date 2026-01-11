import { drizzle } from 'drizzle-orm/node-postgres';
import { Hono } from 'hono';
import { renderer } from './renderer';
import usuariosController from '@/usuarios/application/usuarios-controller';
import { EnvironmentVariables, Singletons } from './cross-cut/distributed-services/hono-types';

// Global variable to cache the DB connection across requests on the same worker
// TODO research more about this Cloudflare Workers feature
let dbConnection: ReturnType<typeof drizzle> | null = null;

/*
Es posible pasar un parámetro de tipo al método constructor de una app Hono (https://www.typescriptlang.org/docs/handbook/2/generics.html) para especificar los tipos de:
    * Variables de entorno: Cloudflare worker's Bindings https://hono.dev/docs/getting-started/cloudflare-workers#bindings
    * Variables arbitrarias enviadas entre middlewares con ciclo de vida limitado a la petición web actual (set - get methods https://hono.dev/docs/api/context#set-get)

https://hono.dev/docs/api/hono#generics
*/
const app = new Hono<{ Bindings: EnvironmentVariables, Variables: Singletons }>()
    .use(async (c, next) => {
        //TODO refactor initDBConnection middleware into persistence layer
        if (!dbConnection) {
            dbConnection = drizzle(c.env.VITE_DATABASE_URL);
        }
        //set dbConnection instance so it's available to other middleware
        c.set('drizzleClient', dbConnection);

        await next();
    })
    .use(renderer)
    .get('/', (c) => {
        const nombre = "Florcita";
        return c.render(
            <main>
                <h1>Hello {nombre}!</h1>
                <a href='/usuarios/signup'>Demostración crear usuario</a>
            </main>
        );
    })
    //Para mantener una estructura cohesiva y ordenada, utilizaremos el patrón sugerido por la documentación de Hono. 
    // Se creará una nueva sub-aplicación para cada característica de la aplicación
    //https://hono.dev/docs/guides/best-practices#building-a-larger-application
    .route('/usuarios', usuariosController);

export default app;
