// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import browserslistToEsbuild from 'browserslist-to-esbuild';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import { buildPostBanner, vitePluginCopyFile } from '../../build/vite.config.common';
import pkg from './package.json' with { type: 'json' };

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		dts({
			entryRoot: './src',
			insertTypesEntry: true,
			rollupTypes: true,
			exclude: ['node_modules/**', '**/lib/**', './src/**/*.spec.ts'],
		}),
		vitePluginCopyFile([{ src: '../../LICENSE', dest: '' }]),
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
			external: ['zod'],
		},
	},
});
