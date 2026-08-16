// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { createPrimitiveValidator } from './primitive';

describe('primitiveValidator', async () => {
	const v = createPrimitiveValidator(async (v: number, l: string): Promise<string | undefined> => {
		switch (l) {
			case 'zh-Hans':
				return typeof v === 'number' && v > 18 ? undefined : '无效的值';
			case 'en':
				return typeof v === 'number' && v > 18 ? undefined : 'invalid value';
			default:
				return '未知的语言';
		}
	}, 'und');

	test('valid', async () => {
		let rslt = await v.valid(5);
		expect(rslt[0]).toBeUndefined();
		expect(rslt[1]?.[0].reason).toEqual('未知的语言');

		rslt = await v.valid(20);
		expect(rslt[0]).toBeUndefined();
		expect(rslt[1]?.[0].reason).toEqual('未知的语言');
	});

	test('valid-en', async () => {
		v.changeLocale('en');

		let rslt = await v.valid(5);
		expect(rslt[0]).toBeUndefined();
		expect(rslt[1]?.[0].reason).toEqual('invalid value');

		rslt = await v.valid(20);
		expect(rslt[0]).toEqual(20);
		expect(rslt[1]).toEqual(undefined);
	});

	test('valid-zh-Hans', async () => {
		v.changeLocale('zh-Hans');

		let rslt = await v.valid(5);
		expect(rslt[0]).toBeUndefined();
		expect(rslt[1]?.[0].reason).toEqual('无效的值');

		rslt = await v.valid(20);
		expect(rslt[0]).toEqual(20);
		expect(rslt[1]).toEqual(undefined);
	});
});
