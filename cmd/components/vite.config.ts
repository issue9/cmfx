// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import tailwindcss from '@tailwindcss/vite';
import cssnano from 'cssnano';
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

    plugins: [
        devtools(),
        solidPlugin(),
        tailwindcss(),
    ]
});
