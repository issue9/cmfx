// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        dts({
            entryRoot: './src',
            insertTypesEntry: true,
            rollupTypes: true,
            exclude: [
                'node_modules/**',
                '**/lib/**',
                './src/**/*.spec.ts',
            ]
        }),
        viteStaticCopy({
            targets: [
                { src: '../../LICENSE', dest: '../' },
            ]
        })
    ],

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
            },
            formats: ['es'],
            fileName: (_, name) => `${name}.js`,
        },
        rollupOptions: {
            external: ['vite', 'fs'], // 避免打包 Vite 本身
            output: {
                globals: {
                    vite: 'Vite',
                },
            },
        }
    }
});
