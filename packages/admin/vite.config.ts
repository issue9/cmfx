// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

/// <reference types="vitest" />
import tailwindcss from '@tailwindcss/vite';
import cssnano from 'cssnano';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import solidPlugin from 'vite-plugin-solid';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
    test: {
        environment: 'jsdom',
        exclude: ['**/lib/**'],
        coverage: {
            exclude: ['**/lib/**', '**/demo.tsx', '**/vite.config.ts'],
            reporter: ['text', 'json-summary', ['json', {file: 'report.json'}]],
            reportOnFailure: true,
        }
    },

    plugins: [
        solidPlugin(),
        dts({
            entryRoot: './src',
            insertTypesEntry: true,
            rollupTypes: true,
            exclude: [
                'node_modules/**',
                '**/lib/**',
                './src/**/*.spec.ts',
                './src/**/*.spec.tsx',
                './src/**/demo.tsx',
            ]
        }),
        viteStaticCopy({
            targets: [
                { src: '../../LICENSE', dest: '../' },
                { src: '../../README.md', dest: '../' },
                { src: '../../.browserslistrc', dest: '../' },
            ]
        }),
        tailwindcss()
    ],

    css: {
        postcss: {
            plugins: [cssnano()]
        }
    },

    define: { 'process.env': {} },

    resolve: {
        alias: {
            '@admin': fileURLToPath(new URL('./src', import.meta.url)),
        }
    },

    build: {
        minify: true,
        outDir: './lib',
        target: 'ESNext',
        lib: {
            entry: {
                'index': './src/index.ts',
                'messages/en.lang': './src/messages/en.lang.ts',
                'messages/zh-Hans.lang': './src/messages/zh-Hans.lang.ts',
            },
            formats: ['es'],
            fileName: (_, name) => `${name}.js`,
            cssFileName: 'style',
        },
        rollupOptions: {
            // 不需要打包的内容
            external: ['solid-js', 'solid-js/web', '@cmfx/core', '@cmfx/components', 'material-symbols']
        }
    }
});
