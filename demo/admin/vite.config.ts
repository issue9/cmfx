// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    root: './',
    plugins: [vue()],
});
