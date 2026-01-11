import { drizzle } from 'drizzle-orm/node-postgres';

export interface Singletons {
    //patrón singleton https://refactoring.guru/es/design-patterns/singleton
    drizzleClient: ReturnType<typeof drizzle>;
}export interface EnvironmentVariables {
    VITE_DATABASE_URL: string;
}

