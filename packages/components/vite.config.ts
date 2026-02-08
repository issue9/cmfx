// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import solidPlugin from 'vite-plugin-solid';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tsconfigPaths from 'vite-tsconfig-paths';

import customIcons from '../../build/unplugin-icons';
import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		tsconfigPaths(),
		solidPlugin(),
		viteStaticCopy({
			targets: [
				{ src: '../../LICENSE', dest: '../' },
				{ src: './src/tailwind.css', dest: './' },
			],
		}),
		Icons({
			compiler: 'solid',
			scale: 1,
			customCollections: customIcons,
		}),
		dts({
			entryRoot: './src',
			insertTypesEntry: true,
			rollupTypes: true,
			exclude: ['node_modules/**', '**/lib/**', './src/**/*.spec.ts', './src/**/*.spec.tsx'],
		}),
		tailwindcss(),
	],

	define: { 'process.env': {} },

	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},

	build: {
		minify: true,
		outDir: './lib',
		target: 'ESNext',
		lib: {
			entry: {
				index: './src/index.ts',
				'messages/en.lang': './src/messages/en.lang.ts',
				'messages/zh-Hans.lang': './src/messages/zh-Hans.lang.ts',
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
			external: ['solid-js', '@solidjs/router', '@cmfx/core', 'shiki/bundle/full'],
		},
	},
});
