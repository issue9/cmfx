// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    root: './',
    server: {
        host: true
    },
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('../../admin/src', import.meta.url))
        }
    },
});
