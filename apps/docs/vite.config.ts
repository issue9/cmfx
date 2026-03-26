// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import path from 'node:path';
import { api } from '@cmfx/vite-plugin-api';
import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

import customIcons from '../../build/unplugin-icons';
import { buildPostBanner, vitePluginCopyFile } from '../../build/vite.config.common';
import pkg from './package.json' with { type: 'json' };

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	return {
		base: new URL(pkg.homepage).pathname,
		root: './',
		server: {
			host: true,
		},

		build: {
			minify: true,
			outDir: '../../docs',
			rollupOptions: {
				output: {
					postBanner: buildPostBanner(pkg),
				},
			},
		},

		resolve:
			mode === 'development'
				? {
						alias: [
							{ find: '@cmfx/core', replacement: path.resolve(__dirname, '../../packages/core/src') },
							{ find: '@core', replacement: path.resolve(__dirname, '../../packages/core/src') },

							{ find: '@cmfx/components', replacement: path.resolve(__dirname, '../../packages/components/src') },
							{ find: '@components', replacement: path.resolve(__dirname, '../../packages/components/src') },

							{ find: '@cmfx/illustrations', replacement: path.resolve(__dirname, '../../packages/illustrations/src') },
							{ find: '@illustrations', replacement: path.resolve(__dirname, '../../packages/illustrations/src') },
						],
						tsconfigPaths: true,
					}
				: {
						tsconfigPaths: true,
					},

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
			vitePluginCopyFile([
				{ src: '../../LICENSE', dest: '../../docs' },
				{
					before: true, // 需要在打包之前完成复制
					src: '../../assets/brand-static.svg',
					dest: './public',
					transform: content => {
						return content.replace(/currentColor/g, '#00a1f1');
					},
				},
			]),
			solidPlugin(),
		],
	};
});
