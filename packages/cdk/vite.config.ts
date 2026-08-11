// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import tailwindcss from '@tailwindcss/vite';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import dts from 'unplugin-dts/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

import { buildPostBanner, vitePluginCopyFile } from '../../build/vite.config.common.ts';
import pkg from './package.json' with { type: 'json' };
import cfg from './tsconfig.json' with { type: 'json' };

const outDir = cfg.compilerOptions.outDir;

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		solidPlugin(),
		dts({
			entryRoot: './src',
			bundleTypes: true,
			exclude: ['node_modules/**', `**/${outDir}/**`, './src/**/*.spec.ts'],
		}),
		vitePluginCopyFile([
			{ src: '../../LICENSE', dest: '' },
			{ src: './src/tailwind.css', dest: outDir },
		]),
		tailwindcss(),
	],

	resolve: {
		tsconfigPaths: true,
	},

	build: {
		target: browserslistToEsbuild(),
		minify: true,
		outDir: outDir,
		lib: {
			entry: {
				index: './src/index.ts',
				testenv: './src/testenv/index.ts',
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
			// 打包的 testenv 中不能包含 vitest。
			external: pkg.peerDependencies ? [...Object.keys(pkg.peerDependencies), 'vitest'] : ['vitest'],
		},
	},
});
