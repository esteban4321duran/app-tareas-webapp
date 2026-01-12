import { drizzle } from 'drizzle-orm/node-postgres';
import { testClient } from 'hono/testing';
import { describe, test, expect, afterEach, beforeAll } from 'vitest';
import controller from '@/usuarios/application/usuarios-controller';
import App from '@/index';
import { usersTable } from '@/usuarios/persistence/schema';
import { eq, sql } from 'drizzle-orm';

let dbConnection: ReturnType<typeof drizzle> | null = null;
let client: ReturnType<typeof testClient<typeof App>> | null = null;

//https://vitest.dev/api/#beforeall
beforeAll(async () => {
    console.log(import.meta.env.DATABASE_URL);
    dbConnection = drizzle(import.meta.env.DATABASE_URL!);
    client = testClient(App);
})


//Las pruebas de integración tienen "efectos secundarios", es decir, modifican el estado del sistema en general (por ejemplo, agregan filas a la base de datos).
//queremos mantener un contexto de pruebas consistente para poder ejecutar las pruebas tantas veces como sea necesario y que siempre funcionen de la misma manera.
//Para eso hacemos uso de transacciones en la base de datos envolvemos cada prueba en una transacción. Al final de cada prueba revertimos la transacción para descartar cualquier efecto secundario realizado durante la prueba. De este modo logramos mantener un contexto consistente siempre que ejecutemos las pruebas
//https://orm.drizzle.team/docs/transactions
describe("signup", () => {

    //Utilizamos el estilo Behavior driven design (BDD) para nombrar los escenarios de prueba
    //https://cucumber.io/docs/bdd/better-gherkin#consider-a-more-declarative-style
    describe("when user signs up with valid nombre, apellido & email", () => {
        test("then create new usuario", async () => {
            //setup
            const inputData = {
                apellido: "esteban",
                nombre: "duran",
                email: "esteban.duran@gmail.com"
            }

            //act
            const response = await client!.usuarios.signup.$post({
                form: inputData
            });

            //assert
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
    })
})

// Clean up data after EACH test
afterEach(async () => {
    // "RESTART IDENTITY" resets the ID counters (e.g. id=1)
    // "CASCADE" ensures related data in other tables is also deleted
    await dbConnection!.execute(sql`TRUNCATE TABLE ${usersTable} RESTART IDENTITY CASCADE`);
});