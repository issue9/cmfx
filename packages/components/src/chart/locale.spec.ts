// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { matchLocale } from './locale';

test('matchLocale', async () => {
	expect(matchLocale('zh')).toEqual('ZH');
	expect(matchLocale('zh-Hans')).toEqual('ZH');
});
