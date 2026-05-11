// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type Locale, sleep, type Validator, type ValidResult } from '@cmfx/core';
import { createStore } from 'solid-js/store';
import { describe, expect, test } from 'vitest';

import { API, getFieldValue, setFieldValue } from './api';

type Object = {
	age: number;
	name: string;
	obj1?: {
		age: number;
		name: string;
		'obj-2': {
			age: number;
			name: string;
		};
	};
};

class ObjectValidator implements Validator<Object> {
	changeLocale(_: Locale): void {}
	async valid(v: Object): Promise<ValidResult<Object>> {
		if (v.age < 18) {
			return Promise.resolve([undefined, [{ name: 'age', reason: 'age must be greater than or equal to 18' }]]);
		}
		return Promise.resolve([v, undefined]);
	}
}

describe('API', () => {
	const api = new API({ initValue: { age: 20, name: 'f2' }, validator: new ObjectValidator(), validOnChange: true });

	test('基本属性', async () => {
		expect(api.isPreset()).toEqual<boolean>(true);
		expect(await api.validValue()).toEqual({ age: 20, name: 'f2' });
		expect(api.getValue()).toEqual({ age: 20, name: 'f2' });
		expect(api.validator()).toBeDefined();
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

	test('setError', () => {
		api.setError('error');
		expect(api.getError()).toEqual<string>('error');

		api.setError([{ name: 'age', reason: 'age error' }]);
		expect(api.getError()).toEqual<string>('error');
		expect(api.getError('age')).toEqual<string>('age error');

		api.setError([{ name: 'obj1.name', reason: 'name error' }]);
		expect(api.getError()).toEqual<string>('error');
		expect(api.getError('age')).toEqual<string>('age error');
		expect(api.getError('obj1.name')).toEqual<string>('name error');
	});

	test('reset', () => {
		api.reset();
		expect(api.getError()).toBeUndefined();
		expect(api.getError('age')).toBeUndefined();
		expect(api.getError('obj1.name')).toBeUndefined();
		expect(api.getValue()).toEqual({ age: 20, name: '2' }); // 在 setPreset 将 name 改为了 2
	});
});

describe('API.createFieldAccessor', async () => {
	const api = new API({ initValue: { age: 20, name: 'f2' }, validator: new ObjectValidator(), validOnChange: true });
	const age = api.createFieldAccessor('age');

	test('name', () => {
		expect(age.name()).toEqual('age');
		expect(api.createFieldAccessor('obj1.obj-2.age').name()).toEqual('obj1.obj-2.age');
	});

	test('error', () => {
		expect(age.getError()).toBeUndefined();
		age.setError('error');
		expect(age.getError()).toEqual<string>('error');
	});

	test('value', async () => {
		expect(age.getValue()).toEqual<number>(20);
		age.setValue(25);
		await sleep(500); // setValue 中的验证是异步操作
		expect(age.getValue()).toEqual<number>(25);
		expect(age.getError()).toBeUndefined(); // 触发验证，错误信息被清除
	});

	test('reset', () => {
		age.reset();
		expect(age.getValue()).toEqual<number>(20);
		expect(age.getError()).toBeUndefined();
	});

	test('not-exists', () => {
		// biome-ignore lint/suspicious/noExplicitAny: 不符合参数要求
		const notExists = api.createFieldAccessor<number>('not.exists' as any);
		expect(notExists.getValue()).toBeUndefined();

		notExists.setValue(25);
		expect(notExists.getValue()).toEqual(25);
	});
});

describe('API.onchange', () => {
	const api = new API({ initValue: { age: 20, name: 'f2' }, validator: new ObjectValidator(), validOnChange: true });
	const age = api.createFieldAccessor<number>('age');

	let fieldChangeValue: number | undefined = 0;
	let fieldChangeCount = 0;
	age.onChange(v => {
		fieldChangeValue = v;
		fieldChangeCount++;
	});

	let changeValue: Object = { age: 0, name: '' };
	api.onChange(v => {
		changeValue = v;
	});

	test('age.setValue', () => {
		age.setValue(25);
		expect(fieldChangeValue).toEqual(25);
		expect(changeValue).toEqual({ age: 25, name: 'f2' });
		expect(fieldChangeCount).toEqual(1);
	});

	test('age.reset', () => {
		age.reset();
		expect(fieldChangeValue).toEqual(20);
		expect(changeValue).toEqual({ age: 20, name: 'f2' });
		expect(fieldChangeCount).toEqual(2);
	});

	test('setValue', () => {
		api.setValue({ age: 35, name: 'f2' });
		expect(fieldChangeValue).toEqual(35);
		expect(changeValue).toEqual({ age: 35, name: 'f2' });
		expect(fieldChangeCount).toEqual(3);
	});

	test('reset', () => {
		api.reset();
		expect(fieldChangeValue).toEqual(20);
		expect(changeValue).toEqual({ age: 20, name: 'f2' });
		expect(fieldChangeCount).toEqual(4);
	});
});

describe('getFieldValue', () => {
	const obj = { age: 11, name: '11', obj1: { age: 22, name: '22', 'obj-2': { age: 33, name: '33' } } } as const;

	test('age', () => {
		const value = getFieldValue<Object>(obj, ['age']);
		expect(value).toEqual(11);
	});

	test('obj1.age', () => {
		const value = getFieldValue<Object>(obj, ['obj1', 'age']);
		expect(value).toEqual(22);
	});

	test('obj1.obj-2.name', () => {
		const value = getFieldValue<Object>(obj, ['obj1', 'obj-2', 'name']);
		expect(value).toEqual('33');
	});

	test('not-exists', () => {
		const value = getFieldValue<Object>(obj, ['not-exists']);
		expect(value).toBeUndefined();
	});

	test('obj1.not-exists', () => {
		const value = getFieldValue<Object>(obj, ['obj1', 'not-exists']);
		expect(value).toBeUndefined();
	});

	test('obj1.obj-2.not-exists', () => {
		const value = getFieldValue<Object>(obj, ['obj1', 'obj-2', 'not-exists']);
		expect(value).toBeUndefined();
	});
});

describe('setFieldValue', () => {
	const obj = {
		age: 11,
		name: '11',
		obj1: { age: 22, name: '22', 'obj-2': { age: 33, name: '33' } },
	} as const;

	const [get, set] = createStore(structuredClone(obj));

	test('set age', () => {
		setFieldValue(set, ['age'], 111);
		expect(getFieldValue<Object>(get, ['age'])).toEqual(111);
	});

	test('set obj1.age', () => {
		setFieldValue(set, ['obj1', 'age'], 222);
		expect(getFieldValue<Object>(get, ['obj1', 'age'])).toEqual(222);
	});

	test('set obj1.obj-2.name', () => {
		setFieldValue(set, ['obj1', 'obj-2', 'name'], '333');
		expect(getFieldValue<Object>(get, ['obj1', 'obj-2', 'name'])).toEqual('333');
	});
});
