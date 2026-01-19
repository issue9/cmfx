// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { api } from '@cmfx/vite-plugin-api';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import customIcons from '../../build/unplugin-icons';
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
                { find: '@components', replacement: path.resolve(__dirname, '../../packages/components/src') }, // 解决 components 中的 @ 符号

                { find: '@cmfx/illustrations', replacement: path.resolve(__dirname, '../../packages/illustrations/src') },
                { find: '@illustrations', replacement: path.resolve(__dirname, '../../packages/illustrations/src') },
            ],
        } : undefined,

        plugins: [
            api({
                dts: [
                    [path.resolve(__dirname, '../../packages/core'), 'index.d.ts'],
                    [path.resolve(__dirname, '../../packages/components'), 'index.d.ts'],
                    [path.resolve(__dirname, '../../packages/illustrations'), 'index.d.ts'],
                    [path.resolve(__dirname, '../../packages/admin'), 'index.d.ts'],
                ],
                root: './src',
            }),
            Icons({
                compiler: 'solid',
                scale: 1,
                customCollections: customIcons,
            }),
            tailwindcss(),
            viteStaticCopy({
                targets: [
                    { src: '../../LICENSE', dest: '../apps/docs' }, // dest 是相对于 tsconfig 中 outdir 目录的
                    { src: '../../.browserslistrc', dest: '../apps/docs' },
                    {
                        src: '../../assets/brand-static.svg',
                        dest: '../apps/docs/public',
                        transform: (content, _) => {
                            return content.replace(/currentColor/g, '#00a1f1');
                        }
                    },
                ]
            }),
            solidPlugin(),
        ]
    };
});
