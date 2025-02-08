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
            '@': fileURLToPath(new URL('../../admin/src', import.meta.url))
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
