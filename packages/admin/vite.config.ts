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
            '@cmfx/components/style.css': process.env.NODE_ENV == 'production'
                ? fileURLToPath(new URL('../components/lib/style.css', import.meta.url))
                : fileURLToPath(new URL('../components/src/style.css', import.meta.url)),

            '@cmfx/components/tailwind.css': process.env.NODE_ENV == 'production'
                ? fileURLToPath(new URL('../components/lib/tailwind.css', import.meta.url))
                : fileURLToPath(new URL('../components/src/tailwind.css', import.meta.url)),
            /* 
            '@cmfx/core': process.env.NODE_ENV == 'production'
                ? fileURLToPath(new URL('../core/lib', import.meta.url))
                : fileURLToPath(new URL('../core/src', import.meta.url)),

            '@cmfx/components': process.env.NODE_ENV == 'production'
                ? fileURLToPath(new URL('../components/lib', import.meta.url))
                : fileURLToPath(new URL('../components/src', import.meta.url)),
                */

            '@admin': fileURLToPath(new URL('./src', import.meta.url)),

            // 解决 @cmfx/core 和 @cmfx/components 在 dev 环境下的引用问题
            //'@core': fileURLToPath(new URL('../core/src', import.meta.url)),
            //'@components': fileURLToPath(new URL('../components/src', import.meta.url)),
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
            external: ['solid-js', 'solid-js/web']
        }
    }
});
