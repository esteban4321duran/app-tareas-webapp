import { Context, Hono } from 'hono';
import * as z from 'zod';
import { zValidator } from '@hono/zod-validator';
import type { FC } from 'hono/jsx';
import { crearUsuario } from '../persistence/repositorio-postgres';
import { EnvironmentVariables, Singletons } from '@/cross-cut/distributed-services/hono-types';
import { isPostgresError, PostgresError, UNIQUE_CONSTRAINT_VIOLATION } from '@/cross-cut/persistence/errors-postgres';

//Componente React. Hono lo convierte en HTML antes de enviarlo como respuesta a GET /usuarios/signup
//https://hono.dev/docs/guides/jsx#usage
const SignupForm: FC = (props) => {
    return (
        <form method='post' action="/usuarios/signup">
            <label htmlFor="nombreInput">Nombre:</label>
            <input name='nombre' type="text" id="nombreInput" required></input>
            <small>Por favor, intentá escribir uno o más números en el nombre o apellido.</small>
            <label htmlFor="apellidoInput">Apellido</label>
            <input name='apellido' type="text" id="apellidoInput" required></input>
            <label htmlFor="emailInput">Email</label>
            <input name='email' type="email" id="emailInput" required></input>
            <small>Por favor, intentá crear dos usuarios con el mismo email.</small>
            <button type="submit">Registrarse</button>
        </form>
    )
}


const LONGITUD_MAXIMA = 255;
//definimos un schema zod para validar los datos captados por el formulario. Los nombres los atributos coinciden con los de los atributos <input ... name="...">
//https://zod.dev/basics
//https://zod.dev/error-customization
const signupZodSchema = z.object({
    nombre: z.string()
        .max(LONGITUD_MAXIMA, `Demasiados caracteres (máximo: ${LONGITUD_MAXIMA})`)
        .regex(/^[a-zA-Z]+$/, `No puede contener dígitos`),
    apellido: z.string()
        .max(LONGITUD_MAXIMA, `Demasiados caracteres (máximo: ${LONGITUD_MAXIMA})`)
        .regex(/^[a-zA-Z]+$/, `No puede contener dígitos`),
    email: z.email(`No es un email válido`)
        .max(LONGITUD_MAXIMA, `Demasiados caracteres (máximo: ${LONGITUD_MAXIMA})`),
});

//Si se definen las rutas de la app hono con una serie de métodos encadenados, el helper para pruebas puede inferir las rutas y dar mejores sugerencias al escribir las pruebas
//https://hono.dev/docs/helpers/testing#testclient
const controller = new Hono<{ Bindings: EnvironmentVariables, Variables: Singletons }>()
    .get('/signup', (c) => {
        return c.render(<SignupForm></SignupForm>);
    })
    .post(
        '/signup',
        //https://github.com/honojs/middleware/tree/main/packages/zod-validator
        zValidator('form', signupZodSchema, (result, c) => {
            if (!result.success) {
                c.status(400);
                return c.render(
                    <div>
                        <div>
                            <h2>Error de validación</h2>
                            <ul>
                                {/*  como dar formato a los errores de validación de Zod https://zod.dev/error-formatting*/}
                                {result.error.issues.map((issue) => {
                                    return <li>{issue.path}: {issue.message}</li>
                                })}
                            </ul>
                        </div>
                        <SignupForm></SignupForm>
                    </div>
                )
            }
        }),
        async (c) => {
            //aprovechamos la API de validación de Hono. Como utilizamos un middleware de validación en esta ruta, tenemos acceso a los datos validados mediante el método valid() del objeto c.req
            //https://hono.dev/docs/api/request
            const validated = c.req.valid('form');

            // await crearUsuario(c.get('drizzleClient'), validated);
            try {
                await crearUsuario(c.get('drizzleClient'), validated);
            } catch (error: unknown) {
                if (!isPostgresError) {
                    //no podemos manejar este error. Lanzamos el error de nuevo para que el handler global de errores de Hono se encargue de manejarlo.
                    throw error;
                }
                const DBError = error as PostgresError;
                let mensaje;
                switch (DBError.cause.code) {
                    case UNIQUE_CONSTRAINT_VIOLATION:
                        mensaje = 'Este email ya está siendo utilizado';
                        break;
                    default:
                        mensaje = 'Error en la base de datos.';
                        break;
                }
                return c.render(
                    <div>
                        <h2>Ocurrió un problema</h2>
                        <p>{mensaje}</p>
                        <SignupForm></SignupForm>
                    </div>
                )
            }

            c.status(201);
            return c.render(
                <div>
                    <p>Usuario registrado exitosamente!</p>
                    <p><a href='/'>Volver al inicio</a></p>
                </div>
            );
        });

export default controller;