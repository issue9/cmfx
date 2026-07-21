// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { bro, createGallery, undraw } from './index';

describe('createGallery', () => {
	test('bro', () => {
		const gallery = createGallery('bro');
		expect(gallery).toBe(bro);
	});

	test('optional', () => {
		const gallery = createGallery('bro', { Login: undraw.Login });
		expect(gallery).toBeDefined();
		expect(gallery).not.toBe(bro);
		expect(gallery).not.toBe(undraw);
	});
});
