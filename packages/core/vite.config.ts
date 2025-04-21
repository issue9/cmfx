// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

/// <reference types="vitest" />
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
    test: {
        setupFiles: ['./src/vitest_setup.ts'],
        environment: 'jsdom',
        exclude: ['**/lib/**'],
        coverage: {
            exclude: ['**/lib/**', '**/demo.tsx', '**/vite.config.ts'],
            reporter: ['text', 'json-summary', ['json', {file: 'report.json'}]],
            reportOnFailure: true,
        }
    },

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
                { src: '../../.browserslistrc', dest: '../' },
            ]
        })
    ],

    define: { 'process.env': {} },

    resolve: {
        alias: {
            '@core': fileURLToPath(new URL('./src', import.meta.url))
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
            cssFileName: 'style',
        }
    }
});
