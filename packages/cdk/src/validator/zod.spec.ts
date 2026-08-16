// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { I18n } from '@cmfx/core';
import { describe, expect, test } from 'vitest';
import * as z from 'zod';

import { createZodLocaleLoader, createZodValidator } from './zod';

const usr = z.object({
	name: z.string().min(2).max(100),
	age: z.number().min(18).max(100),
	address: z.array(z.string().min(2).max(100)).length(2),
});

type User = z.infer<typeof usr>;

describe('zod', async () => {
	const enLoader = createZodLocaleLoader((await import('../../node_modules/zod/v4/locales/en.js')).default);
	const zhLoader = createZodLocaleLoader((await import('../../node_modules/zod/v4/locales/zh-CN.js')).default);

	I18n.init('en');
	await I18n.addDict('en', enLoader);
	await I18n.addDict('zh', zhLoader);

	test('valid', async () => {
		const user: User = {
			name: 'John Doe',
			age: 25,
			address: ['123 Main St', '456 Elm St'],
		};

		const result = await createZodValidator(usr).valid(user);
		expect(result[0]).toEqual(user);
		expect(result[1]).toBeUndefined();
	});

	test('changeLocale', async () => {
		const user: User = {
			name: 'John Doe',
			age: 12,
			address: ['123 Main St', ''],
		};

		const v = createZodValidator(usr);

		let result = await v.valid(user);
		expect(result[0]).toBeUndefined();
		expect(result[1]![0].name).toEqual('age');
		expect(result[1]![0].reason).toEqual('Too small: expected number to be >=18');
		expect(result[1]![1].name).toEqual('address[1]');

		// 切换语言-相似名称

		v.changeLocale('zh-CN');
		result = await v.valid(user);
		expect(result[0]).toBeUndefined();
		expect(result[1]![0].name).toEqual('age');
		expect(result[1]![0].reason).toEqual('数值过小：期望 number >=18');
		expect(result[1]![1].name).toEqual('address[1]');

		// 切换语言-同名

		v.changeLocale('zh');
		result = await v.valid(user);
		expect(result[0]).toBeUndefined();
		expect(result[1]![0].name).toEqual('age');
		expect(result[1]![0].reason).toEqual('数值过小：期望 number >=18');
		expect(result[1]![1].name).toEqual('address[1]');
	});

	test('invalid-zh', async () => {
		const user: User = {
			name: 'John Doe',
			age: 12,
			address: ['123 Main St', ''],
		};

		const result = await createZodValidator(usr, new I18n('zh-CN', 'full')).valid(user);
		expect(result[0]).toBeUndefined();
		expect(result[1]![0].name).toEqual('age');
		expect(result[1]![0].reason).toEqual('数值过小：期望 number >=18');
		expect(result[1]![1].name).toEqual('address[1]');
	});

	test('with path', async () => {
		const user: User = {
			name: 'John Doe',
			age: 12,
			address: ['123 Main St', ''],
		};

		let result = await createZodValidator<User>(usr, new I18n('zh', 'full')).valid(user.name, 'name');
		expect(result[0]).toEqual('John Doe');
		expect(result[1]).toBeUndefined();

		result = await createZodValidator<User>(usr, new I18n('zh', 'full')).valid(user.age, 'age');
		expect(result[0]).toBeUndefined();
		expect(result[1]![0].name).toEqual('age');
	});

	test('primitive', async () => {
		const v = 5;

		let result = await createZodValidator<number>(z.number().min(1), new I18n('zh', 'full')).valid(v);
		expect(result[0]).toEqual(5);
		expect(result[1]).toBeUndefined();

		result = await createZodValidator<number>(usr.shape.age, new I18n('zh', 'full')).valid(v);
		expect(result[0]).toBeUndefined();
		expect(result[1]![0].name).toEqual('');
	});
});
