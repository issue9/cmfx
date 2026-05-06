// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type Locale, sleep, type Validator, type ValidResult } from '@cmfx/core';
import { describe, expect, test } from 'vitest';

import { API } from './api';

type Object = {
	age: number;
	name: string;
};

describe('API', async () => {
	const validator: Validator<Object> = {
		changeLocale(_: Locale): void {},

		async valid(v: Object): Promise<ValidResult<Object>> {
			if (v.age < 18) {
				return Promise.resolve([undefined, [{ name: 'age', reason: 'age must be greater than or equal to 18' }]]);
			}
			return Promise.resolve([v, undefined]);
		},
	};

	const api = new API({ initValue: { age: 20, name: 'f2' }, validator, validOnChange: true });

	test('基本属性', async () => {
		expect(api.isPreset()).toEqual<boolean>(true);
		expect(await api.validValue()).toEqual({ age: 20, name: 'f2' });
		expect(api.getValue()).toEqual({ age: 20, name: 'f2' });
	});

	test('createFieldAccessor', async () => {
		const age = api.createFieldAccessor('age');

		expect(age.getError()).toBeUndefined();
		expect(age.getValue()).toEqual<number>(20);

		age.setError('error');
		expect(age.getError()).toEqual<string>('error');

		age.setValue(25);
		expect(age.getValue()).toEqual<number>(25);
		await sleep(500); // setValue 中的验证是异步操作
		expect(age.getError()).toBeUndefined(); // 触发验证，错误信息被清除

		age.reset();
		expect(age.getValue()).toEqual<number>(20);
		expect(age.getError()).toBeUndefined();

		// biome-ignore lint/suspicious/noExplicitAny: any
		const notExists = api.createFieldAccessor<number>('not.exists' as any);
		expect(notExists.getValue()).toEqual('');

		notExists.setValue(25);
		expect(notExists.getValue()).toEqual(25);
	});

	test('setPreset', () => {
		api.setPreset({ age: 20, name: '2' });
		expect(api.isPreset()).toBeFalsy();
		api.reset();
		expect(api.isPreset()).toBeTruthy();
		expect(api.createFieldAccessor('age').getValue()).toEqual(20);

		api.createFieldAccessor('age').setValue(22);
		expect(api.isPreset()).toBeFalsy();
	});

	test('setValue', () => {
		api.setValue({ age: 21, name: '22' });
		expect(api.createFieldAccessor('age').getValue()).toEqual(21);
		expect(api.createFieldAccessor('name').getValue()).toEqual('22');
	});
});
