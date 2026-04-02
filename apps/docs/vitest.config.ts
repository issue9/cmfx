// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';
import solidPlugin from 'vite-plugin-solid';
import { defineConfig } from 'vitest/config';

import customIcons from '../../build/unplugin-icons';

export default defineConfig({
	// vite.config.ts 中包含了大量的不必要设置，这里只取了其中的必要插件。

	plugins: [
		Icons({
			compiler: 'solid',
			scale: 1,
			customCollections: customIcons,
		}),
		tailwindcss(),
		solidPlugin(),
	],
	test: {
		environment: 'jsdom',
	},
});
