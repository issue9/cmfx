// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import path from 'node:path';
//import basicSsl from '@vitejs/plugin-basic-ssl';
import { about } from '@cmfx/vite-plugin-about';
import tailwindcss from '@tailwindcss/vite';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

import customIcons from '../../build/unplugin-icons';
import { buildPostBanner, vitePluginCopyFile } from '../../build/vite.config.common';
import pkg from './package.json' with { type: 'json' };

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	return {
		root: './',
		server: {
			host: true,
		},

		build: {
			target: browserslistToEsbuild(),
			sourcemap: true,
			rolldownOptions: {
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

							{
								find: /^@cmfx\/admin\/(.*).lang/,
								replacement: path.resolve(__dirname, `../../packages/admin/src/messages/$1.lang.ts`),
							},
							{ find: '@cmfx/admin', replacement: path.resolve(__dirname, '../../packages/admin/src') },
							{ find: '@admin', replacement: path.resolve(__dirname, '../../packages/admin/src') }, // 解决 admin 中的 @admin 引用

							{
								find: /^@cmfx\/components\/(.*).lang/,
								replacement: path.resolve(__dirname, `../../packages/components/src/messages/$1.lang.ts`),
							},
							{ find: '@cmfx/components', replacement: path.resolve(__dirname, '../../packages/components/src') },
							{ find: '@components', replacement: path.resolve(__dirname, '../../packages/components/src') }, // 解决 admin 中的 @admin 引用

							{
								find: /^@cmfx\/illustrations\/(.*).lang/,
								replacement: path.resolve(__dirname, `../../packages/illustrations/src/messages/$1.lang.ts`),
							},
							{ find: '@cmfx/illustrations', replacement: path.resolve(__dirname, '../../packages/illustrations/src') },
							{ find: '@illustrations', replacement: path.resolve(__dirname, '../../packages/illustrations/src') },
						],

						tsconfigPaths: true,
					}
				: {
						tsconfigPaths: true,
					},

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
			vitePluginCopyFile([
				{ src: '../../LICENSE', dest: '' },
				{
					before: true, // 需要在打包之前完成复制
					src: '../../assets/brand-static.svg',
					dest: 'public',
					transform: content => {
						return content.replace(/currentColor/g, '#00a1f1');
					},
				},
			]),
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
