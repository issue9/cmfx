// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { api } from '@cmfx/vite-plugin-api';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    return {
        base: '/cmfx/', // 项目地址是 https://issue9.github.io/cmfx/
        root: './',
        server: {
            host: true
        },

        build: {
            minify: true,
            outDir: '../../docs',
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
                { find: '@cmfx/components', replacement: path.resolve(__dirname, '../../packages/components/src') },
                { find: '@', replacement: path.resolve(__dirname, '../../packages/components/src') }, // 解决 components 中的 @ 符号
            ],
        } : undefined,

        plugins: [
            api({
                components: '../../packages/components',
                root: './src/demo',
            }),
            Icons({ compiler: 'solid', scale: 1 }),
            tailwindcss(),
            viteStaticCopy({
                targets: [
                    { src: '../../LICENSE', dest: '../apps/docs' }, // dest 是相对于 tsconfig 中 outdir 目录的
                    { src: '../../.browserslistrc', dest: '../apps/docs' },
                    { src: '../../logo.svg', dest: '../apps/docs/public/' },
                ]
            }),
            solidPlugin(),
        ]
    };
});
