// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import solidPlugin from 'vite-plugin-solid';

import customIcons from '../../build/unplugin-icons';
import { buildPostBanner, vitePluginCopyFile } from '../../build/vite.config.common';
import pkg from './package.json' with { type: 'json' };

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		solidPlugin(),
		vitePluginCopyFile([{ src: '../../LICENSE', dest: '' }]),
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
		tsconfigPaths: true,
	},

	build: {
		minify: true,
		outDir: './lib',
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
		rolldownOptions: {
			output: {
				postBanner: buildPostBanner(pkg),
			},
			// 不需要打包的内容
			external: ['solid-js', '@solidjs/router', '@cmfx/core', 'shiki/bundle/full'],
		},
	},
});
