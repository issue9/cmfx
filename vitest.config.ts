// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { defineConfig as defineViteConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { defineConfig, mergeConfig } from 'vitest/config';

// 需要排除的文件，同时作用在 test.exclude 和 test.coverage.exclude 字段。
const exclude = [
    '**/index.ts',
    '**/index.tsx',
    '**/lib/**',
    '**/node_modules/**',
    '**/vite.config.ts',
    '**/vitest.config.ts',
    '**/vitest_setup.ts'
];

export default mergeConfig(
    defineViteConfig({
        plugins: [
            solidPlugin() // 必须要有，否则所有测试的 isServer 始终为 true。
        ]
    }),
    defineConfig({
        test: {
            workspace: ['packages/core', 'packages/components', 'packages/admin'],
            environment: 'jsdom',
            exclude: exclude,
            coverage: {
                include: ['packages/**/*.ts', 'packages/**/*.tsx'],
                clean: false,
                reportsDirectory: './coverage',
                provider: 'v8',
                exclude: exclude,
                reporter: ['text', 'text-summary', ['json', { file: 'ts.json' }]],
                reportOnFailure: true,
            }
        },
    })
);
