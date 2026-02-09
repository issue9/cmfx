// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import solidPlugin from 'vite-plugin-solid';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tsconfigPaths from 'vite-tsconfig-paths';

import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		tsconfigPaths(),
		solidPlugin(),
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

	build: {
		minify: true,
		outDir: './lib',
		target: 'ESNext',
		lib: {
			entry: {
				index: './src/index.ts',
			},
			formats: ['es'],
			fileName: (_, name) => `${name}.js`,
			cssFileName: 'style',
		},
		rollupOptions: {
			output: {
				banner: chunk => {
					if (chunk.isEntry) {
						return `/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.homepage}
 * ${pkg.license} licensed
 */`;
					} else {
						return '';
					}
				},
			},

			// 不需要打包的内容
			external: ['solid-js', '@cmfx/core', '@cmfx/components'],
		},
	},
});
