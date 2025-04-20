// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

//import basicSsl from '@vitejs/plugin-basic-ssl';
import tailwindcss from '@tailwindcss/vite';
import cssnano from 'cssnano';
import { fileURLToPath, URL } from 'node:url';
import devtools from 'solid-devtools/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

// https://vitejs.dev/config/
export default defineConfig({
    root: './',
    server: {
        host: true
    },

    build: {
        sourcemap: true
    },

    css: {
        postcss: {
            plugins: [cssnano()]
        }
    },

    resolve: {
        alias: {
            '@cmfx/admin/style.css': process.env.NODE_ENV == 'production'
                ? fileURLToPath(new URL('../../packages/admin/lib/style.css', import.meta.url))
                : fileURLToPath(new URL('../../packages/admin/src/style.css', import.meta.url)),
            '@cmfx/components/tailwind.css': process.env.NODE_ENV == 'production'
                ? fileURLToPath(new URL('../../packages/components/lib/tailwind.css', import.meta.url))
                : fileURLToPath(new URL('../../packages/components/src/tailwind.css', import.meta.url)),

            '@cmfx/core': process.env.NODE_ENV == 'production'
                ? fileURLToPath(new URL('../../packages/core/lib', import.meta.url))
                : fileURLToPath(new URL('../../packages/core/src', import.meta.url)),
            '@cmfx/admin': process.env.NODE_ENV == 'production'
                ? fileURLToPath(new URL('../../packages/admin/lib', import.meta.url))
                : fileURLToPath(new URL('../../packages/admin/src', import.meta.url)),
            '@cmfx/components': process.env.NODE_ENV == 'production'
                ? fileURLToPath(new URL('../../packages/components/lib', import.meta.url))
                : fileURLToPath(new URL('../../packages/components/src', import.meta.url)),

            '@admin': fileURLToPath(new URL('../../packages/admin/src', import.meta.url)),
            '@core': fileURLToPath(new URL('../../packages/core/src', import.meta.url)),
            '@components': fileURLToPath(new URL('../../packages/components/src', import.meta.url)),
        }
    },

    plugins: [
        devtools(),
        solidPlugin(),
        tailwindcss(),
        /*
        basicSsl({
            name: 'test',
            domains: ['localhost'],
            certDir: './ssl'
        })
        */
    ]
});
