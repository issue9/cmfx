// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

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
            '@cmfx/components/demo': fileURLToPath(new URL('../../packages/components/src/demo', import.meta.url)), // demo 始终指向 components/src
            '@components': fileURLToPath(new URL('../../packages/components/src', import.meta.url)),
            '@core': fileURLToPath(new URL('../../packages/core/src', import.meta.url)),

            '@cmfx/components': process.env.NODE_ENV == 'production'
                ? fileURLToPath(new URL('../../packages/components/lib', import.meta.url))
                : fileURLToPath(new URL('../../packages/components/src', import.meta.url)),
            '@cmfx/core': process.env.NODE_ENV == 'production'
                ? fileURLToPath(new URL('../../packages/core/lib', import.meta.url))
                : fileURLToPath(new URL('../../packages/core/src', import.meta.url)),
        }
    },

    plugins: [
        devtools(),
        solidPlugin(),
        tailwindcss(),
    ]
});
