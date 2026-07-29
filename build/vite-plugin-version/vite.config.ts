// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import dts from 'unplugin-dts/vite';
import { defineConfig } from 'vite';

import { buildPluginTarget, buildPostBanner, vitePluginCopyFile } from '../vite.config.common';
import pkg from './package.json' with { type: 'json' };
import cfg from './tsconfig.json' with { type: 'json' };

const outDir = cfg.compilerOptions.outDir;

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		dts({
			entryRoot: './src',
			bundleTypes: true,
			exclude: ['node_modules/**', `**/${outDir}/**`, './src/**/*.spec.ts', 'src/version/**'],
		}),
		vitePluginCopyFile([
			{ src: '../../LICENSE', dest: '' },
			{ src: './src/version/index.ts', dest: 'lib/version' },
			{ src: './src/version/checker.ts', dest: 'lib/version' },
			{ src: './src/version/env.d.ts', dest: 'lib/version' },
		]),
	],

	build: {
		minify: true,
		outDir: outDir,
		target: buildPluginTarget(),
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
			external: ['vite', 'node:fs', 'node:path'],
		},
	},
});
