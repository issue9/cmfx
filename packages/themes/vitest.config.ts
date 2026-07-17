// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import solidPlugin from 'vite-plugin-solid';
import { defineProject, mergeConfig } from 'vitest/config';

import { sharedWebConfig } from '../../vitest.config';

export default mergeConfig(
	sharedWebConfig,
	defineProject({
		plugins: [solidPlugin()],
	}),
);
