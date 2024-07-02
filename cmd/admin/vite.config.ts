// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import basicSsl from '@vitejs/plugin-basic-ssl';
import autoprefixer from 'autoprefixer';
import { fileURLToPath, URL } from 'node:url';
import devtools from 'solid-devtools/vite';
import tailwindcss from 'tailwindcss';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

// https://vitejs.dev/config/
export default defineConfig({
    root: './',
    server: {
        host: true
    },

    css: {
        postcss: {
            plugins: [tailwindcss(), autoprefixer()]
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
        basicSsl({
            name: 'test',
            domains: ['localhost'],
            certDir: './ssl'
        })
    ]
});
