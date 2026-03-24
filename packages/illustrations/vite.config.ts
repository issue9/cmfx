// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import solidPlugin from 'vite-plugin-solid';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import { buildPostBanner } from '../../build/vite.config.base';
import pkg from './package.json' with { type: 'json' };

const outDir = './lib';

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
		viteStaticCopy({
			targets: [{ src: path.resolve(__dirname, '../../LICENSE'), dest: path.resolve(__dirname, outDir) }],
		}),
		tailwindcss(),
	],

	define: { 'process.env': {} },

	resolve: {
		tsconfigPaths: true,
	},

	build: {
		minify: true,
		outDir: outDir,
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
			external: ['solid-js', '@cmfx/core', '@cmfx/components'],
		},
	},
});
