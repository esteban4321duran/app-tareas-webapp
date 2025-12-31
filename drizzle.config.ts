import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: './src/**/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        //we can safely rely on nodejs APIs such as process.env because drizzle-kit will only be run on the dev environment
        //drizzle-kit relies on dotenv package to read environment variables. This implies setting up env variables in a .env file
        url: process.env.DATABASE_URL!,
    },
});
