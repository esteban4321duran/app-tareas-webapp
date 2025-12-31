
import type { drizzle } from 'drizzle-orm/node-postgres';
import { usersTable } from './schema';

export async function crearUsuario(
    drizzleClient: ReturnType<typeof drizzle>,
    //mediante typeof schemaTabla.$inferInsert se pueden inferir los datos que deben estar presentes para ejecutar un insert en la tabla
    //https://orm.drizzle.team/docs/insert
    datosUsuario: typeof usersTable.$inferInsert
) {
    await drizzleClient.insert(usersTable).values(datosUsuario);
}