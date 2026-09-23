// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { sleep, type Validator, type ValidResult } from '@cmfx/core';
import { createStore } from 'solid-js/store';
import { describe, expect, test } from 'vitest';

import { FormContext, getFieldValue, setFieldValue } from './context';

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
	changeLocale(_: string): void {}
	async valid(v: Object): Promise<ValidResult<Object>> {
		if (v.age < 18) {
			return Promise.resolve([undefined, [{ name: 'age', reason: 'age must be greater than or equal to 18' }]]);
		}
		return Promise.resolve([v, undefined]);
	}
}

describe('FormContext', () => {
	const ctx = new FormContext<Object>({
		initValue: { age: 20, name: 'f2' },
		validator: new ObjectValidator(),
		validOnChange: true,
	});

	test('基本属性', async () => {
		expect(ctx.isPreset()).toEqual<boolean>(true);
		expect(await ctx.validValue()).toEqual({ age: 20, name: 'f2' });
		expect(ctx.getValue()).toEqual({ age: 20, name: 'f2' });
		expect(ctx.validator()).toBeDefined();
	});

	test('setPreset', () => {
		ctx.setPreset({ age: 20, name: '2' });
		expect(ctx.isPreset()).toBeFalsy();
		ctx.reset();
		expect(ctx.isPreset()).toBeTruthy();
		expect(ctx.createField('age', 'ageid').getValue()).toEqual(20);

		ctx.createField('age', 'ageid-2').setValue(22);
		expect(ctx.isPreset()).toBeFalsy();
	});

	test('setValue', () => {
		ctx.setValue({ age: 21, name: '22' });
		expect(ctx.createField('age', 'ageid').getValue()).toEqual(21);
		expect(ctx.createField('name', 'nameid').getValue()).toEqual('22');
	});

	test('setError', () => {
		ctx.setError('error');
		expect(ctx.getError()).toEqual<string>('error');

		ctx.setError([{ name: 'age', reason: 'age error' }]);
		expect(ctx.getError()).toEqual<string>('error');
		expect(ctx.getError('age')).toEqual<string>('age error');

		ctx.setError([{ name: 'obj1.name', reason: 'name error' }]);
		expect(ctx.getError()).toEqual<string>('error');
		expect(ctx.getError('age')).toEqual<string>('age error');
		expect(ctx.getError('obj1.name')).toEqual<string>('name error');
	});

	test('reset', () => {
		ctx.reset();
		expect(ctx.getError()).toBeUndefined();
		expect(ctx.getError('age')).toBeUndefined();
		expect(ctx.getError('obj1.name')).toBeUndefined();
		expect(ctx.getValue()).toEqual({ age: 20, name: '2' }); // 在 setPreset 将 name 改为了 2
	});
});

describe('FormContext.createField', async () => {
	const ctx = new FormContext({
		initValue: { age: 20, name: 'f2' },
		validator: new ObjectValidator(),
		validOnChange: true,
	});
	const age = ctx.createField('age', 'ageid');

	test('id/name/inForm', () => {
		expect(age.id).toBeDefined();
		expect(age.name).toEqual('age');

		const age2 = ctx.createField('obj1.obj-2.age', 'obj1.obj-2.ageid');
		expect(age2.name).toEqual('obj1.obj-2.age');
		expect(age2.id).toEqual('obj1.obj-2.ageid');

		// 多次调用 createField，id 不会变化。
		const age3 = ctx.createField('obj1.obj-2.age', 'obj1.obj-2.ageid-2');
		expect(age3.name).toEqual('obj1.obj-2.age');
		expect(age3.id).toEqual('obj1.obj-2.ageid');
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
		const notExists = ctx.createField<number>('not.exists' as any, 'id');
		expect(notExists.getValue()).toBeUndefined();

		notExists.setValue(25);
		expect(notExists.getValue()).toEqual(25);
	});
});

describe('FormContext.onchange', () => {
	const ctx = new FormContext({
		initValue: { age: 20, name: 'f2' },
		validator: new ObjectValidator(),
		validOnChange: true,
	});
	const age = ctx.createField<number>('age', 'ageid');

	let fieldChangeValue: number | undefined = 0;
	let fieldChangeCount = 0;
	age.onChange(v => {
		fieldChangeValue = v;
		fieldChangeCount++;
	});

	let changeValue: Object = { age: 0, name: '' };
	let changeCount = 0;
	ctx.onChange(v => {
		changeValue = { ...v };
		changeCount++;
	});

	test('age.setValue', () => {
		age.setValue(25);
		expect(fieldChangeValue).toEqual(25);
		expect(fieldChangeCount).toEqual(1);
		expect(changeValue).toEqual({ age: 25, name: 'f2' });
		expect(changeCount).toEqual(1);

		// silent
		age.setValue(35, true);
		expect(fieldChangeValue).toEqual(25);
		expect(fieldChangeCount).toEqual(1);
		expect(changeValue).toEqual({ age: 25, name: 'f2' });
		expect(changeCount).toEqual(1);
	});

	test('age.reset', () => {
		// silent
		age.reset(true);
		expect(fieldChangeValue).toEqual(25);
		expect(fieldChangeCount).toEqual(1);
		expect(changeValue).toEqual({ age: 25, name: 'f2' });
		expect(changeCount).toEqual(1);

		age.setValue(30, true); // 上面已经 reset，需要重新调整值才能触发 onChange 事件

		age.reset();
		expect(fieldChangeCount).toEqual(2);
		expect(fieldChangeValue).toEqual(20);
		expect(changeValue).toEqual({ age: 20, name: 'f2' });
		expect(changeCount).toEqual(2);

		age.setValue(30, true); // 上面已经 reset，需要重新调整值才能触发 onChange 事件

		// silent
		age.reset(true);
		expect(fieldChangeValue).toEqual(20);
		expect(fieldChangeCount).toEqual(2);
		expect(changeValue).toEqual({ age: 20, name: 'f2' });
		expect(changeCount).toEqual(2);
	});

	test('setValue', () => {
		// silent
		ctx.setValue({ age: 40, name: 'f2' }, true);
		expect(fieldChangeValue).toEqual(20);
		expect(fieldChangeCount).toEqual(2);
		expect(changeValue).toEqual({ age: 20, name: 'f2' });
		expect(changeCount).toEqual(2);

		ctx.setValue({ age: 35, name: 'f2' });
		expect(fieldChangeValue).toEqual(35);
		expect(fieldChangeCount).toEqual(3);
		expect(changeValue).toEqual({ age: 35, name: 'f2' });
		expect(changeCount).toEqual(3);

		// silent
		ctx.setValue({ age: 40, name: 'f2' }, true);
		expect(fieldChangeValue).toEqual(35);
		expect(fieldChangeCount).toEqual(3);
		expect(changeValue).toEqual({ age: 35, name: 'f2' });
		expect(changeCount).toEqual(3);
	});

	test('reset', () => {
		// silent
		ctx.reset(true);
		expect(fieldChangeValue).toEqual(35);
		expect(fieldChangeCount).toEqual(3);
		expect(changeValue).toEqual({ age: 35, name: 'f2' });
		expect(changeCount).toEqual(3);

		ctx.setValue({ age: 35, name: 'f2' }, true); // 上面已经 reset，需要重新调整值才能触发 onChange 事件

		ctx.reset();
		expect(fieldChangeValue).toEqual(20);
		expect(fieldChangeCount).toEqual(4);
		expect(changeValue).toEqual({ age: 20, name: 'f2' });
		expect(changeCount).toEqual(4);

		ctx.setValue({ age: 35, name: 'f2' }, true); // 上面已经 reset，需要重新调整值才能触发 onChange 事件

		// silent
		ctx.reset(true);
		expect(fieldChangeValue).toEqual(20);
		expect(fieldChangeCount).toEqual(4);
		expect(changeValue).toEqual({ age: 20, name: 'f2' });
		expect(changeCount).toEqual(4);
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
