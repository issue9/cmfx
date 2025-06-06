// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import tailwindcss from '@tailwindcss/vite';
import cssnano from 'cssnano';
import path from 'path';
import devtools from 'solid-devtools/vite';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    return {
        root: './',
        server: {
            host: true
        },

        build: {
            sourcemap: true
        },

        css: {
            postcss: {
                plugins: [cssnano()]
            }
        },

        resolve: mode === 'development' ? {
            alias: [
                { find: '@cmfx/components', replacement: path.resolve(__dirname, '../../packages/components/src') },
                { find: '@', replacement: path.resolve(__dirname, '../../packages/components/src') }, // 解决 components 中的 @ 符号
            ],
        } : undefined,

        plugins: [
            devtools(),
            solidPlugin(),
            Icons({ compiler: 'solid', scale: 1 }),
            tailwindcss(),
        ]
    };
});
