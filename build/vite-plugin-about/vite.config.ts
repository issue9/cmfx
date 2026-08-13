// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import dts from 'unplugin-dts/vite';
import { defineConfig } from 'vite';

import { buildPluginTarget, buildPostBanner, vitePluginCopyFile } from '../vite.config.common.ts';
import pkg from './package.json' with { type: 'json' };
import cfg from './tsconfig.json' with { type: 'json' };

const outDir = cfg.compilerOptions.outDir;

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		dts({
			entryRoot: './src',
			bundleTypes: {
				extractorConfig: {
					newlineKind: 'lf', // 换行符统一为 LF
				},
			},
			exclude: ['node_modules/**', `**/${outDir}/**`, './src/**/*.spec.ts'],
		}),
		vitePluginCopyFile([{ src: '../../LICENSE', dest: '' }]),
	],

	build: {
		target: buildPluginTarget(),
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
