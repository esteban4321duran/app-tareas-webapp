import { integer, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

interface TimestampSchema {
    created_at: ReturnType<typeof timestamp>;
    modified_at: ReturnType<typeof timestamp>;
    deleted_at: ReturnType<typeof timestamp>;
}

//patrón avanzado para reutilizar parte de un schema https://orm.drizzle.team/docs/sql-schema-declaration#advanced
const timestampSchema: TimestampSchema = {
    created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
    modified_at: timestamp({ withTimezone: true }),
    deleted_at: timestamp({ withTimezone: true }),
}
export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    nombre: varchar({ length: 255 }).notNull(),
    apellido: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    ...timestampSchema
});