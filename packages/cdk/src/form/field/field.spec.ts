// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { createFormField } from './field';

describe('createFakeField', () => {
	const ctx = createFormField(20);

	let changeValue: number | undefined = 0;
	let changeCount = 0;
	ctx.onChange(v => {
		changeValue = v;
		changeCount++;
	});

	test('id/name/inForm', () => {
		expect(ctx.name).toBeDefined();
		expect(ctx.id).toBeDefined();
		expect(ctx.inForm).toBeFalsy();
	});

	test('value', () => {
		expect(ctx.getValue()).toEqual(20);
		ctx.setValue(25);
		expect(ctx.getValue()).toEqual(25);

		expect(changeValue).toEqual(25);
		expect(changeCount).toEqual(1);
	});

	test('reset', () => {
		ctx.reset();

		expect(ctx.getValue()).toEqual(20);
		expect(changeValue).toEqual(20);
		expect(changeCount).toEqual(2);
	});

	test('error', () => {
		expect(ctx.getError()).toBeUndefined();
		ctx.setError('error');
		expect(ctx.getError()).toEqual('error');

		// 改值，重置了 ERROR
		ctx.setValue(0);
		expect(ctx.getError()).toBeUndefined();
	});
});
