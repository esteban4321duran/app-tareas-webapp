import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, ViteClient } from 'vite-ssr-components/hono'

export const renderer = jsxRenderer(({ children }) => {
    return (
        <html>
            <head>
                <ViteClient />
                {/* <Link href="/src/style.css" rel="stylesheet" /> */}
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.pink.min.css"
                ></link>
            </head>
            <body class="container">{children}</body>
        </html>
    )
})
