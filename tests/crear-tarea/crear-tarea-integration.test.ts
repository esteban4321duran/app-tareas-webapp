import { drizzle } from 'drizzle-orm/node-postgres';
import { testClient } from 'hono/testing';
import { describe, test, expect, afterEach, beforeAll } from 'vitest';
import App from '@/index';
import { usersTable } from '@/usuarios/persistence/schema';
import { eq, sql } from 'drizzle-orm';
import { EnvironmentVariables } from '@/cross-cut/distributed-services/hono-types';
import dayjs, { Dayjs } from 'dayjs';

let dbConnection: ReturnType<typeof drizzle> | null = null;
let clientePruebas: ReturnType<typeof testClient<typeof App>> | null = null;

//https://vitest.dev/api/#beforeall
beforeAll(async () => {
    dbConnection = drizzle(import.meta.env.DATABASE_URL!);

    const testEnvVars: EnvironmentVariables = {
        DATABASE_URL: import.meta.env.DATABASE_URL
    };

    clientePruebas = testClient(App, testEnvVars);
})

/*
nombre de una prueba
        Dadas (condiciones)
        Cuando (acciones)
        Entonces (resultados esperados)
*/
describe('crear usuario', () => {
    test(`
        given datos correctos
        when creo una tarea
        then guardar una tarea en el sistema
        `, () => {
        //preparar
        const inputData = {
            //para las fechas y horas utilizaremos la librería dayjs
            //https://day.js.org/docs/en/parse/now
            fechaHora: dayjs(),
            Titulo: "Crear un proyecto",
            detalles: 'Preparas us1'
        }
        //actuar
        const respuesta = null;


        //afirmar
        expect(response.status).toBe(201);
        const result = await dbConnection!
            .select()
            .from(tareasTable)
        expect(result).toHaveLength(1);
    });
    test(`
        Dados falta título fecha y hora
        Cuando creo una tarea
        Entonces no guardar una tarea en el sistema
        `, () => {


    });

});

afterEach(async () => {

    await dbConnection!.execute(sql`TRUNCATE TABLE ${tareasTable} RESTART IDENTITY CASCADE`);
});