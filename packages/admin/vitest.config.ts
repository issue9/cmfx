// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';
import solidPlugin from 'vite-plugin-solid';
import { defineProject, mergeConfig } from 'vitest/config';

import { sharedWebConfig } from '../../vitest.config';

export default mergeConfig(
	sharedWebConfig,
	defineProject({
		plugins: [
			Icons({
				compiler: 'solid',
				scale: 1,
			}),
			tailwindcss(),
			solidPlugin(),
		],
		test: {
			setupFiles: ['./src/vitest_setup.ts'],
			server: {
				deps: {
					inline: ['@solidjs/router'], // vitest v4 必须要加
				},
			},
		},
	}),
);
