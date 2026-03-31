// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import tailwindcss from '@tailwindcss/vite';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import solidPlugin from 'vite-plugin-solid';

import { buildPostBanner, vitePluginCopyFile } from '../../build/vite.config.common';
import pkg from './package.json' with { type: 'json' };

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		solidPlugin(),
		dts({
			entryRoot: './src',
			insertTypesEntry: true,
			rollupTypes: true,
			exclude: ['node_modules/**', '**/lib/**', './src/**/*.spec.ts'],
		}),
		vitePluginCopyFile([{ src: '../../LICENSE', dest: '' }]),
		tailwindcss(),
	],

	resolve: {
		tsconfigPaths: true,
	},

	build: {
		target: browserslistToEsbuild(),
		minify: true,
		outDir: './lib',
		lib: {
			entry: {
				index: './src/index.ts',
				'en.lang': './src/messages/en.lang.ts',
				'zh-Hans.lang': './src/messages/zh-Hans.lang.ts',
			},
			formats: ['es'],
			fileName: (_, name) => `${name}.js`,
			cssFileName: 'style',
		},
		rolldownOptions: {
			output: {
				postBanner: buildPostBanner(pkg),
			},

			// 不需要打包的内容
			external: ['solid-js', '@cmfx/core', '@cmfx/components'],
		},
	},
});
