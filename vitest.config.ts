import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";
import { fileURLToPath } from 'url'
import { loadEnv } from "vite";

export default defineWorkersConfig(({ mode }) => ({
    resolve: {
        alias: {
            // This maps '@' to your 'src' directory
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    test: {
        env: loadEnv(mode, process.cwd(), ''),
        poolOptions: {
            workers: {
                wrangler: { configPath: "./wrangler.jsonc" },
            },
        },
    },
}));