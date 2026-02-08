// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import path from 'node:path';
//import basicSsl from '@vitejs/plugin-basic-ssl';
import { about } from '@cmfx/vite-plugin-about';
import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import customIcons from '../../build/unplugin-icons';
import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	return {
		root: './',
		server: {
			host: true,
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
						} else {
							return '';
						}
					},
				},
			},
		},

		resolve:
			mode === 'development'
				? {
						alias: [
							{ find: '@cmfx/core', replacement: path.resolve(__dirname, '../../packages/core/src') },
							{ find: '@core', replacement: path.resolve(__dirname, '../../packages/core/src') },

							{ find: '@cmfx/admin', replacement: path.resolve(__dirname, '../../packages/admin/src') },
							{ find: '@admin', replacement: path.resolve(__dirname, '../../packages/admin/src') }, // 解决 admin 中的 @admin 引用

							{ find: '@cmfx/components', replacement: path.resolve(__dirname, '../../packages/components/src') },
							{ find: '@components', replacement: path.resolve(__dirname, '../../packages/components/src') }, // 解决 admin 中的 @admin 引用

							{ find: '@cmfx/illustrations', replacement: path.resolve(__dirname, '../../packages/illustrations/src') },
							{ find: '@illustrations', replacement: path.resolve(__dirname, '../../packages/illustrations/src') },
						],
					}
				: undefined,

		plugins: [
			Icons({
				compiler: 'solid',
				scale: 1,
				customCollections: customIcons,
			}),
			tailwindcss(),
			about({
				packages: ['./package.json'],
				gomods: ['../../go.mod'],
			}),
			viteStaticCopy({
				targets: [
					{ src: '../../LICENSE', dest: '../' },
					{
						src: '../../assets/brand-static.svg',
						dest: '../public/',
						transform: (content, _) => {
							return content.replace(/currentColor/g, '#00a1f1');
						},
					},
				],
			}),
			solidPlugin(),
			/*
            basicSsl({
                name: 'test',
                domains: ['localhost'],
                certDir: './ssl'
            })
            */
		],
	};
});
