// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import {fileURLToPath, URL} from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
    root: './',
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('../../admin/src', import.meta.url))
        }
    },
});
