// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { vi } from 'vitest';

// https://github.com/jsdom/jsdom/issues/3522
window.matchMedia =
	window.matchMedia ||
	vi.fn(() => {
		return {
			matches: false,
			media: '',
			onchange: null,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		};
	});
