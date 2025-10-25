// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import Icons from 'unplugin-icons/vite';
import solid from 'vite-plugin-solid';
import { defineConfig } from 'vitest/config';

// 需要排除的文件，同时作用在 test.exclude 和 test.coverage.exclude 字段。
const exclude = [
    '**/index.ts',
    '**/index.tsx',
    '**/lib/**',
    '**/node_modules/**',
    '**/vite.config.ts',
    '**/vitest.config.ts',
    '**/vitest_setup.ts',
    '**/*.{test,spec}.ts',
    '**/*.{test,spec}.tsx',
];

export default defineConfig({
    plugins: [
        Icons({ compiler: 'solid', scale: 1 }),
        solid(), // 必须要有，否则所有测试的 isServer 始终为 true。
    ],
    test: {
        projects: [
            'packages/core',
            'packages/components',
            'packages/illustrations',
            'packages/admin',

            'build/vite-plugin-about',
            'build/vite-plugin-api',
        ],
        environment: 'jsdom',
        exclude: exclude,
        coverage: {
            enabled: true,
            include: ['packages/**/*.{ts,tsx}', 'build/vite-plugin-*/**/*.{ts,tsx}'],
            clean: false,
            reportsDirectory: './coverage',
            provider: 'v8',
            exclude: exclude,
            reporter: [
                ['text'],
                ['json', { file: 'ts.json' }],
            ],
            reportOnFailure: true,
        },
    },
});
