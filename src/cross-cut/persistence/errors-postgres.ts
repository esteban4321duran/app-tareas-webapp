import * as z from 'zod';

/*
Error ejemplo postgres
_DrizzleQueryError: Failed query: insert into "users" ("id", "nombre", "apellido", "email", "created_at", "modified_at", "deleted_at") values (default, $1, $2, $3, default, default, default)
params: esteban,duran,esteban.duran@gmail.com
    at NodePgPreparedQuery.queryWithCache (/home/esteban/projects/app-tareas-webapp/node_modules/.vite/deps_app_tareas_webapp/chunk-RHIICS6V.js:7161:15)
    at crearUsuario (/home/esteban/projects/app-tareas-webapp/src/usuarios/persistence/repositorio-postgres.ts:11:5)
    ... 5 lines matching cause stack trace ...
    at /home/esteban/projects/app-tareas-webapp/src/index.tsx:28:5
    at dispatch (/home/esteban/projects/app-tareas-webapp/node_modules/.vite/deps_app_tareas_webapp/hono.js:41:17)
    at /home/esteban/projects/app-tareas-webapp/node_modules/.vite/deps_app_tareas_webapp/hono.js:1116:25 {
  query: 'insert into "users" ("id", "nombre", "apellido", "email", "created_at", "modified_at", "deleted_at") values (default, $1, $2, $3, default, default, default)',
  params: [ 'esteban', 'duran', 'esteban.duran@gmail.com' ],
  cause: error: duplicate key value violates unique constraint "users_email_unique"
      at /home/esteban/projects/app-tareas-webapp/node_modules/.vite/deps_app_tareas_webapp/drizzle-orm_node-postgres.js:4367:15
      at /home/esteban/projects/app-tareas-webapp/node_modules/.vite/deps_app_tareas_webapp/drizzle-orm_node-postgres.js:5326:20
      at NodePgPreparedQuery.queryWithCache (/home/esteban/projects/app-tareas-webapp/node_modules/.vite/deps_app_tareas_webapp/chunk-RHIICS6V.js:7159:16)
      at crearUsuario (/home/esteban/projects/app-tareas-webapp/src/usuarios/persistence/repositorio-postgres.ts:11:5)
      at /home/esteban/projects/app-tareas-webapp/src/usuarios/application/usuarios-controller.tsx:74:9
      at dispatch (/home/esteban/projects/app-tareas-webapp/node_modules/.vite/deps_app_tareas_webapp/hono.js:41:17)
      at /home/esteban/projects/app-tareas-webapp/node_modules/.vite/deps_app_tareas_webapp/@hono_zod-validator.js:151:12
      at dispatch (/home/esteban/projects/app-tareas-webapp/node_modules/.vite/deps_app_tareas_webapp/hono.js:41:17)
      at dispatch (/home/esteban/projects/app-tareas-webapp/node_modules/.vite/deps_app_tareas_webapp/hono.js:41:17)
      at /home/esteban/projects/app-tareas-webapp/src/index.tsx:28:5 {
    length: 221,
    severity: 'ERROR',
    code: '23505',
    detail: 'Key (email)=(esteban.duran@gmail.com) already exists.',
    hint: undefined,
    position: undefined,
    internalPosition: undefined,
    internalQuery: undefined,
    where: undefined,
    schema: 'public',
    table: 'users',
    column: undefined,
    dataType: undefined,
    constraint: 'users_email_unique',
    file: 'nbtinsert.c',
    line: '666',
    routine: '_bt_check_unique'
  }
}

*/

export const postgresErrorZodSchema = z.object({
    query: z.string(),
    cause: z.object({
        severity: z.string(),
        code: z.string(),
        detail: z.string(),
        schema: z.string(),
        table: z.string(),
        column: z.optional(z.string()),
    })
});
export type PostgresError = z.infer<typeof postgresErrorZodSchema>;

//códigos de error postgres
//https://www.postgresql.org/docs/current/errcodes-appendix.html
export const UNIQUE_CONSTRAINT_VIOLATION = '23505';

export function isPostgresError(error: unknown): boolean {
    const result = postgresErrorZodSchema.safeParse(error);
    return result.success;
}
