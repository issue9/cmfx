// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import solidPlugin from 'vite-plugin-solid';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        workspace: ['packages/core', 'packages/components', 'packages/admin'],
        environment: 'jsdom',
        exclude: ['**/lib/**', '**/node_modules/**'],
        coverage: {
            exclude: ['lib/**', 'vite.config.ts', 'node_modules/**'],
            reporter: ['text', 'json-summary', ['json', { file: 'report.json' }]],
            reportOnFailure: true,
        }
    },
    plugins: [
        solidPlugin() // 必须要有，否则所有测试的 isserver 始终为 true。
    ]
});

