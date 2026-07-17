// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { defineConfig, defineProject } from 'vitest/config';

export default defineConfig({
	test: {
		projects: [
			'packages/*/vitest.config.ts',

			'apps/docs',

			'build/vite-plugin-about',
			'build/vite-plugin-api',
		],
		coverage: {
			enabled: true,
			include: ['packages/**/*.{ts,tsx}', 'apps/docs/**/.{ts,tsx}', 'build/vite-plugin-*/**/*.{ts,tsx}'],
			clean: false,
			reportsDirectory: './coverage',
			provider: 'v8',
			exclude: [
				'**/lib/**',
				'**/node_modules/**',
				'**/vite.config.ts',
				'**/vitest.config.ts',
				'**/vitest_setup.ts',
				'**/*.{test,spec}.ts',
				'**/*.{test,spec}.tsx',
				'**/mod.ts',
				'**/index.ts',
			],
			reporter: [['text'], ['json', { file: 'ts.json' }]],
			reportOnFailure: true,
		},
	},
});

/**
 * 前端插件的公共测试配置
 */
export const sharedNodeConfig = defineProject({
	test: {
		environment: 'node',
	},
});

/**
 * 前端项目的公共测试配置
 */
export const sharedWebConfig = defineProject({
	resolve: {
		tsconfigPaths: true,
	},
	test: {
		environment: 'jsdom',
		execArgv: ['--localstorage-file', path.resolve(os.tmpdir(), `vitest-${process.pid}.localstorage`)],
	},
});
