import { drizzle } from 'drizzle-orm/node-postgres';
import { Hono } from 'hono';
import { renderer } from './renderer';

// Global variable to cache the DB connection across requests on the same worker
// TODO research more about this Cloudflare Workers feature
let dbConnection: ReturnType<typeof drizzle> | null = null;

/* 
Es posible pasar un parámetro de tipo al método constructor de una app Hono (https://www.typescriptlang.org/docs/handbook/2/generics.html) para especificar los tipos de:
    * Variables de entorno: Cloudflare worker's Bindings https://hono.dev/docs/getting-started/cloudflare-workers#bindings
    * Variables arbitrarias enviadas entre middlewares con ciclo de vida limitado a la petición web actual (set - get methods https://hono.dev/docs/api/context#set-get)

https://hono.dev/docs/api/hono#generics
*/
interface Singletons {
    //patrón singleton https://refactoring.guru/es/design-patterns/singleton
    dbConnection: ReturnType<typeof drizzle>;
};
interface EnvironementVariables {
    DATABASE_URL: string;
}
const app = new Hono<{ Bindings: EnvironementVariables, Variables: Singletons }>();

//TODO refactor initDBConnection middleware into persistence layer
app.use(async (c, next) => {
    if (!dbConnection) {
        dbConnection = drizzle(c.env.DATABASE_URL);
    }
    //set dbConnection instance so it's available to other middleware
    c.set('dbConnection', dbConnection);

    await next();
})
app.use(renderer);

app.get('/', (c) => {
    const nombre = "florcita";
    return c.render(<h1>Hello! {nombre}</h1>);
})

export default app;
