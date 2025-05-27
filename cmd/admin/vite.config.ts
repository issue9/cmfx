// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

//import basicSsl from '@vitejs/plugin-basic-ssl';
import { about } from '@cmfx/vite-plugin-about';
import tailwindcss from '@tailwindcss/vite';
import cssnano from 'cssnano';
import path from 'path';
import devtools from 'solid-devtools/vite';
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
                { find: '@cmfx/admin', replacement: path.resolve(__dirname, '../../packages/admin/src') },
                { find: '@', replacement: path.resolve(__dirname, '../../packages/admin/src') }, // 解决 admin 中的 @ 符号
            ],
        } : undefined,

        plugins: [
            devtools(),
            solidPlugin(),
            tailwindcss(),
            about({
                packages: ['./package.json'],
                gomods: ['../../go.mod']
            }),

            /*
            basicSsl({
                name: 'test',
                domains: ['localhost'],
                certDir: './ssl'
            })
            */
        ]
    };
});
