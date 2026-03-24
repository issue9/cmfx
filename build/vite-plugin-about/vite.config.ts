// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import path from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import { buildPostBanner } from '../vite.config.base';
import pkg from './package.json' with { type: 'json' };

const outDir = './lib';

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
			targets: [{ src: path.resolve(__dirname, '../../LICENSE'), dest: path.resolve(__dirname, outDir) }],
		}),
	],

	build: {
		minify: true,
		outDir: outDir,
		lib: {
			entry: {
				index: './src/index.ts',
			},
			formats: ['es'],
			fileName: (_, name) => `${name}.js`,
		},
		rolldownOptions: {
			output: {
				postBanner: buildPostBanner(pkg),
			},
			external: ['vite', 'node:fs', 'node:process', 'node:path', '@cmfx/admin'],
		},
	},
});
