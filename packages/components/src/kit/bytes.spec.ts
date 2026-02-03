// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { I18n } from '@cmfx/core';
import { expect, test } from 'vitest';

import { createBytesFormatter } from './bytes';

test('createBytesFormatter', async () => {
	I18n.init('en');
	await I18n.addDict('en', async () => {
		return { lang: 'en' };
	});

	const l = new I18n('en', 'full');
	const f = createBytesFormatter(l);
	expect(f(1022)).equal('1,022 bytes');
	expect(f(1026)).equal('1.002 kilobytes');
	expect(f(10261111)).equal('9.786 megabytes');
	expect(f(9999261111)).equal('9.313 gigabytes');
	expect(f(99998888261111)).equal('90.948 terabytes');
});
