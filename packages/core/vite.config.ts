// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import { buildPostBanner } from '../../build/vite.config.base';
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
		viteStaticCopy({
			targets: [{ src: '../../LICENSE', dest: '../' }],
		}),
	],

	define: { 'process.env': {} },

	resolve: {
		tsconfigPaths: true,
	},

	build: {
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
