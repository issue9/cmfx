// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import path from 'node:path';
import { api } from '@cmfx/vite-plugin-api';
import { version } from '@cmfx/vite-plugin-version';
import mdx from '@mdx-js/rollup';
import tailwindcss from '@tailwindcss/vite';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import remarkGfm from 'remark-gfm';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

import customIcons from '../../build/unplugin-icons.ts';
import { buildPostBanner, vitePluginCopyFile } from '../../build/vite.config.common.ts';
import pkg from './package.json' with { type: 'json' };
import cfg from './tsconfig.json' with { type: 'json' };

const outDir = cfg.compilerOptions.outDir;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	return {
		base: new URL(pkg.homepage).pathname,
		root: './',
		server: {
			host: true,
		},

		build: {
			target: browserslistToEsbuild(),
			minify: true,
			outDir: outDir,
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
							{ find: '@cmfx/core', replacement: path.resolve(import.meta.dirname, '../../packages/core/src') },
							{ find: '@core', replacement: path.resolve(import.meta.dirname, '../../packages/core/src') },

							{
								find: /^@cmfx\/admin\/(.*).lang/,
								replacement: path.resolve(import.meta.dirname, `../../packages/admin/src/messages/$1.lang.ts`),
							},
							{ find: '@cmfx/admin', replacement: path.resolve(import.meta.dirname, '../../packages/admin/src') },
							{ find: '@admin', replacement: path.resolve(import.meta.dirname, '../../packages/admin/src') },

							{
								find: /^@cmfx\/components\/(.*).lang/,
								replacement: path.resolve(import.meta.dirname, `../../packages/components/src/messages/$1.lang.ts`),
							},
							{
								find: '@cmfx/components',
								replacement: path.resolve(import.meta.dirname, '../../packages/components/src'),
							},
							{ find: '@components', replacement: path.resolve(import.meta.dirname, '../../packages/components/src') },

							{
								find: /^@cmfx\/themes\/(.*).lang/,
								replacement: path.resolve(import.meta.dirname, `../../packages/themes/src/messages/$1.lang.ts`),
							},
							{ find: '@cmfx/themes', replacement: path.resolve(import.meta.dirname, '../../packages/themes/src') },
							{ find: '@themes', replacement: path.resolve(import.meta.dirname, '../../packages/themes/src') },

							{
								find: /^@cmfx\/illustrations\/(.*).lang/,
								replacement: path.resolve(import.meta.dirname, `../../packages/illustrations/src/messages/$1.lang.ts`),
							},
							{
								find: '@cmfx/illustrations',
								replacement: path.resolve(import.meta.dirname, '../../packages/illustrations/src'),
							},
							{
								find: '@illustrations',
								replacement: path.resolve(import.meta.dirname, '../../packages/illustrations/src'),
							},
						],
						tsconfigPaths: true,
					}
				: {
						tsconfigPaths: true,
					},

		plugins: [
			{
				enforce: 'pre',
				...vitePluginCopyFile([
					{
						before: true, // 需要在打包之前完成复制
						src: '../../assets/brand-static.svg',
						dest: './public',
						transform: content => {
							return content.replace(/currentColor/g, '#00a1f1');
						},
					},
					{ src: '../../LICENSE', before: true, dest: './public' },
					{ src: '../../CONTRIBUTING.md', before: true, dest: './src/contribute' },
					{ src: '../../README.md', before: true, dest: './src/docs/intro' },
					{ src: '../../CHANGELOG.md', before: true, dest: './src/docs/intro' },
				]),
			},
			{
				enforce: 'pre',
				...api({
					dts: [
						[path.resolve(import.meta.dirname, '../../packages/core'), 'index.d.ts'],
						[path.resolve(import.meta.dirname, '../../packages/components'), 'index.d.ts'],
						[path.resolve(import.meta.dirname, '../../packages/themes'), 'index.d.ts'],
						[path.resolve(import.meta.dirname, '../../packages/illustrations'), 'index.d.ts'],
						[path.resolve(import.meta.dirname, '../../packages/admin'), 'index.d.ts'],
					],
					root: './src',
				}),
			},
			{ enforce: 'pre', ...mdx({ jsxImportSource: 'solid-js/h', remarkPlugins: [remarkGfm] }) },
			Icons({
				compiler: 'solid',
				scale: 1,
				customCollections: customIcons,
			}),
			tailwindcss(),
			solidPlugin({ extensions: ['.mdx'] }),
			version(),
		],
	};
});
