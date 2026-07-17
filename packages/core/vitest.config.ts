// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { defineProject, mergeConfig } from 'vitest/config';

import { sharedWebConfig } from '../../vitest.config';

export default mergeConfig(
	sharedWebConfig,
	defineProject({
		test: {
			setupFiles: ['./src/vitest_setup.ts'],
		},
	}),
);
