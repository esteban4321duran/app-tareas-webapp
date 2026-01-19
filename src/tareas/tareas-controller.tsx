import { EnvironmentVariables, Singletons } from '@/cross-cut/distributed-services/hono-types';
import { Context, Hono } from 'hono';
import { FC } from 'hono/jsx';
//tenemso que hacer dos cosas para definir una app hono
//primero llamar a la funcion Hono()
const controller = new Hono<{ Bindings: EnvironmentVariables, Variables: Singletons }>()
    .get('/', (c) => {
        return c.render(<PaginaInicio></PaginaInicio>)
    });
//     })
//     .post(

// )

const PaginaInicio: FC = (props) => {
    return (
        <html>
            <head></head>
            <body>

            </body>
        </html>
    )
}


//segundo exportar la app desde este módulo Typescript
export default controller;