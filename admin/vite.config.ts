// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

/// <reference types="vitest" />
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import { fileURLToPath, URL } from 'node:url';
import tailwindcss from 'tailwindcss';
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
            exclude: ['**/lib/**'],
            reporter: ['text', 'json-summary', 'json'],
            reportOnFailure: true,
        }
    },

    plugins: [
        solidPlugin(),
        dts({
            insertTypesEntry: true,
            rollupTypes: true
        }),
        viteStaticCopy({
            targets: [
                { src: '../LICENSE', dest: '../' },
                { src: '../README.md', dest: '../' },
            ]
        })
    ],

    css: {
        postcss: {
            plugins: [tailwindcss(), autoprefixer(), cssnano()]
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
                'pages': './src/pages/index.ts',
                'core': './src/core/index.ts',
                'messages/en': './src/messages/en.ts',
                'messages/zh-Hans': './src/messages/zh-Hans.ts',
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
