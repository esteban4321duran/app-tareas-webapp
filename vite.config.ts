import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig } from 'vite'
import ssrPlugin from 'vite-ssr-components/plugin'
//need to install @types/node
import { fileURLToPath } from 'url'

export default defineConfig(({ mode }) => {
    const plugins = []
    if (mode !== 'test')
        plugins.push(cloudflare())
    plugins.push(ssrPlugin())

    return {
        plugins,
        resolve: {
            alias: {
                // This maps '@' to your 'src' directory
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        test: {
            environment: 'node',
            globals: true
        }
    }
})
