// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

//import basicSsl from '@vitejs/plugin-basic-ssl';
import { about } from '@cmfx/vite-plugin-about';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    return {
        root: './',
        server: {
            host: true
        },

        build: {
            sourcemap: true,
            rollupOptions: {
                output: {
                    banner: chunk => {
                        if (chunk.isEntry) {
                            return `/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.homepage}
 * ${pkg.license} licensed
 */`;
                        } else { return ''; }
                    }
                }
            }
        },

        resolve: mode === 'development' ? {
            alias: [
                { find: '@cmfx/admin', replacement: path.resolve(__dirname, '../../packages/admin/src') },
                { find: '@', replacement: path.resolve(__dirname, '../../packages/admin/src') }, // 解决 admin 中的 @ 符号
            ],
        } : undefined,

        plugins: [
            solidPlugin(),
            Icons({ compiler: 'solid', scale: 1 }),
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
