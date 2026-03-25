// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import { buildPostBanner, vitePluginCopyFile } from '../vite.config.common';
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

	build: {
		minify: true,
		outDir: './lib',
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
