// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

window.EventSource =
	window.EventSource ||
	vi.fn().mockImplementation(() => ({
		close: vi.fn(() => {}),
		addEventListener: vi.fn((event: string, callback: (_message?: MessageEvent) => object) => {
			if (event === 'connect') {
				callback();
			}
		}),
	}));
