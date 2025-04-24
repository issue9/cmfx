// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import solidPlugin from 'vite-plugin-solid';
import { defineConfig } from 'vitest/config';

// 需要排除的文件，同时作用在 test.exclude 和 test.coverage.exclude 字段。
const exclude = ['**/lib/**', '**/node_modules/**', 'cmd/**', '**/vite.config.ts', '**/vitest.config.ts', 'eslint.config.mjs'];

export default defineConfig({
    test: {
        workspace: ['packages/core', 'packages/components', 'packages/admin'],
        environment: 'jsdom',
        exclude: exclude,
        coverage: {
            clean: false,
            reportsDirectory: './coverage',
            provider: 'v8',
            exclude: exclude,
            reporter: ['text', 'text-summary', ['json', { file: 'ts.json' }]],
            reportOnFailure: true,
        }
    },
    plugins: [
        solidPlugin() // 必须要有，否则所有测试的 isServer 始终为 true。
    ]
});

