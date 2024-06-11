// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

/// <reference types="vitest" />
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
    test: {
        environment: 'jsdom'
    },

    plugins: [
        vue(),
        dts({
            insertTypesEntry: true,
            rollupTypes: true
        })
    ],

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
                //'components': './src/components/index.ts',
                //'pages': './src/pages/index.ts'
            },
            formats: ['es', 'cjs'],
            fileName: (format, name) => `${name}.${format}.js`
        },
        rollupOptions: {
            // 不需要打包的内容
            external: ['vue', 'vuetify', 'vue-i18n', 'vue-router']
        }
    }
});
