// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

/// <reference types="vitest" />
import autoprefixer from 'autoprefixer';
import { fileURLToPath, URL } from 'node:url';
import tailwindcss from 'tailwindcss';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import solidPlugin from 'vite-plugin-solid';
//import devtools from 'solid-devtools/vite';

// https://vitejs.dev/config/
export default defineConfig({
    test: {
        environment: 'jsdom',
        coverage: {
            reporter: ['text', 'json-summary', 'json'],
            reportOnFailure: true,
        }
    },

    plugins: [
        //devtools(),
        solidPlugin(),
        dts({
            insertTypesEntry: true,
            rollupTypes: true
        })
    ],

    css: {
        postcss: {
            plugins: [tailwindcss(), autoprefixer()]
        }
    },

    define: { 'process.env': {} },

    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },

    build: {
        minify: true,
        outDir: './lib',
        target: 'ESNext',
        lib: {
            entry: {
                'index': './src/index.ts',
                'components': './src/components/index.ts',
                'pages': './src/pages/index.ts'
            },
            formats: ['es', 'cjs'],
            fileName: (format, name) => `${name}.${format}.js`
        },
        rollupOptions: {
            // 不需要打包的内容
            external: ['solid-js', 'solid-js/web']
        }
    }
});
