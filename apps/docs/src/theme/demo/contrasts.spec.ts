// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { getContrasts } from './contrasts';

describe('getContrasts', () => {
	const c = getContrasts();

	test('none', () => {
		expect(c.get('none')).toEqual({
			'--opacity': '50%',
			'--contrast': '90%',
		});
	});

	test('less', () => {
		expect(c.get('none')).toEqual({
			'--opacity': '30%',
			'--contrast': '80%',
		});
	});
});
