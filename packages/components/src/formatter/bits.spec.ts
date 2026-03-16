// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { I18n } from '@cmfx/core';
import { expect, test } from 'vitest';

import { createBits } from './bits';

test('createBits', async () => {
	I18n.init('en');
	await I18n.addDict('en', async () => {
		return { lang: 'en' };
	});

	const l = new I18n('en', 'full');
	const f = createBits(l);
	expect(f(1022)).equal('1,022 bits');
	expect(f(1026)).equal('1.002 kilobits');
	expect(f(10261111)).equal('9.786 megabits');
	expect(f(9999261111)).equal('9.313 gigabits');

	expect(createBits(l, 'bit')(99998888261111)).equal('99998888261111 bits');

	expect(createBits(l, 'bit', 'minute')(99998888261111)).equal('99998888261111 bits per minute');
});
