import { drizzle } from 'drizzle-orm/node-postgres';
import { testClient } from 'hono/testing';
import { describe, test, expect, afterEach, beforeAll } from 'vitest';
import App from '@/index';
import { usersTable } from '@/usuarios/persistence/schema';
import { eq, sql } from 'drizzle-orm';
import { EnvironmentVariables } from '@/cross-cut/distributed-services/hono-types';

let dbConnection: ReturnType<typeof drizzle> | null = null;
let clientePruebas: ReturnType<typeof testClient<typeof App>> | null = null;

//https://vitest.dev/api/#beforeall
beforeAll(async () => {
    /*Setup para pruebas de integración
    Hono deja a la plataforma donde se está ejecutando la responsabilidad de inyectar las variables de entorno en el objeto request context.
    Cuando la plataforma es el servidor de desarrollo de vite (npm run dev), este servidor inyecta automáticamente las variables de entorno.
    Sin embargo, cuando vitest ejecuta las pruebas, la plataforma es la herramienta para pruebas de integración testClient(). Debemos pasar como argumento las variables de entorno para ser inyectadas.

    explicación: https://gemini.google.com/share/33130ec0cc59

    signatura de la función testClient: https://github.com/honojs/hono/blob/ef2a4b8d77711c9308a6ddca9e35d4ff321f97fe/src/helper/testing/index.ts#L18
    */

    // Inicializamos una conexión con la base de datos
    dbConnection = drizzle(import.meta.env.DATABASE_URL!);

    // Preparamos las variables de entorno que queremos inyectar en el objeto request context de nuestra app Hono
    const testEnvVars: EnvironmentVariables = {
        DATABASE_URL: import.meta.env.DATABASE_URL
    };

    // Pasamos la app Hono y las variables de entorno.
    clientePruebas = testClient(App, testEnvVars);
})


//Las pruebas de integración tienen "efectos secundarios", es decir, modifican el estado del sistema en general (por ejemplo, agregan filas a la base de datos).
//queremos mantener un contexto de pruebas consistente para poder ejecutar las pruebas tantas veces como sea necesario y que siempre funcionen de la misma manera.
//para eso "truncamos" (limpiamos) las tablas de la BD al final de cada prueba para descartar cualquier efecto secundario realizado durante la prueba. De este modo logramos mantener un contexto consistente siempre que ejecutemos las pruebas
describe("signup", () => {

    //Utilizamos el estilo Behavior driven design (BDD) para nombrar los escenarios de prueba
    //https://cucumber.io/docs/bdd/better-gherkin#consider-a-more-declarative-style
    test("when user signs up with valid nombre, apellido & email then create new usuario", async () => {
        //setup (preparar)
        const inputData = {
            apellido: "esteban",
            nombre: "duran",
            email: "esteban.duran@gmail.com"
        }

        //act (actuar)
        const response = await clientePruebas!.usuarios.signup.$post({
            form: inputData
        });

        //assert (afirmar)
        expect(response.status).toBe(201);
        const result = await dbConnection!
            .select()
            .from(usersTable)
            .where(
                eq(usersTable.email, inputData.email),
            );
        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject(inputData);
    });
    test("when user signs up with invalid nombre, then user is not created", async () => {
        //setup (preparar)
        const inputData = {
            nombre: "esteban123",
            apellido: "duran",
            email: "esteban.duran@gmail.com"
        }

        //act (actuar)
        const response = await clientePruebas!.usuarios.signup.$post({
            form: inputData
        });

        //assert (afirmar)
        expect(response.status).toBe(400);
        const result = await dbConnection!
            .select()
            .from(usersTable)
            .where(
                eq(usersTable.email, inputData.email),
            );
        expect(result).toHaveLength(0);
    });
    test.todo("when user signs up with invalid apellido, then user is not created");
    test.todo("when user signs up with invalid email, then user is not created");
    test("given email already in use, when user signs up with valid data, then user is not created", async () => {
        //setup (preparar)
        const inputData1 = {
            apellido: "duran",
            nombre: "esteban",
            email: "esteban.duran@gmail.com"
        }
        const inputData2 = {
            apellido: "duran",
            nombre: "esteban",
            email: "esteban.duran@gmail.com"
        }
        await clientePruebas!.usuarios.signup.$post({
            form: inputData1
        });
        //act (actuar)
        const response = await clientePruebas!.usuarios.signup.$post({
            form: inputData2
        });

        //assert (afirmar)
        expect(response.status).toBe(400);
        const result = await dbConnection!
            .select()
            .from(usersTable)
            .where(
                eq(usersTable.email, inputData1.email),
            );
        expect(result).toHaveLength(0);
    });
});

// limpiar tablas después de cada prueba
afterEach(async () => {
    // "RESTART IDENTITY" reinicia los contadores de IDs al número 1
    // "CASCADE" ensures related data in other tables is also deleted
    // "CASCADE" nos asegura que los datos relacionados en otras tablas también son borrados
    await dbConnection!.execute(sql`TRUNCATE TABLE ${usersTable} RESTART IDENTITY CASCADE`);
});