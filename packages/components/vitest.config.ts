// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(viteConfig, defineConfig({
    test: {
        setupFiles: ['./src/vitest_setup.ts'],
        environment: 'jsdom',
        server: {
            deps: {
                inline: ['@solidjs/router'] // vitest v4 必须要加
            }
        }
    }
}));
