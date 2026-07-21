// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import tailwindcss from '@tailwindcss/vite';
import solidPlugin from 'vite-plugin-solid';
import { defineProject, mergeConfig } from 'vitest/config';

import { sharedWebConfig } from '../../vitest.config';

export default mergeConfig(
	sharedWebConfig,
	defineProject({
		plugins: [solidPlugin(), tailwindcss()],
		test: {
			css: true,
			setupFiles: ['./src/vitest_setup.ts'],
		},
	}),
);
