// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { renderHook } from '@solidjs/testing-library';
import type { ParentProps } from 'solid-js';
import { afterAll, describe, expect, test } from 'vitest';

import { API } from '@components/form/api';
import { buildFakeFieldContext, buildFieldContext, FieldProvider, useField } from './field';

type Obj = {
	age: number;
	name: string;
};

describe('FieldProvider', async () => {
	const api = new API<Obj>({ initValue: { age: 20, name: 'f2' } });

	const { result, cleanup } = renderHook(() => useField<number>(), {
		wrapper: (props: ParentProps) => (
			<FieldProvider ctx={buildFieldContext('id', 'age', api)}>{props.children}</FieldProvider>
		),
	});

	test('useField', () => {
		expect(result?.id()).toEqual('id');
		expect(result?.name()).toEqual('age');

		expect(result?.getValue()).toEqual(20);
		result?.setValue(25);
		expect(result?.getValue()).toEqual(25);

		expect(result?.getError()).toBeUndefined();
		result?.setError('error');
		expect(result?.getError()).toEqual('error');

		expect(result?.getExtra()).toBeUndefined();
		result?.setExtra('extra');
		expect(result?.getExtra()).toEqual('extra');

		result?.reset();
		expect(result?.getError()).toBeUndefined();
		expect(result?.getValue()).toEqual(20);
	});

	afterAll(cleanup);
});

describe('buildFakeFieldContext', () => {
	const ctx = buildFakeFieldContext(20);

	test('id/name', () => {
		expect(ctx.id()).toBeDefined();
		expect(ctx.name()).toBeDefined();
	});

	test('value', () => {
		expect(ctx.getValue()).toEqual(20);
		ctx.setValue(25);
		expect(ctx.getValue()).toEqual(25);
	});

	test('reset', () => {
		ctx.reset();
		expect(ctx.getValue()).toEqual(20);
	});

	test('error', () => {
		expect(ctx.getError()).toBeUndefined();
		ctx.setError('error');
		expect(ctx.getError()).toBeUndefined();
	});

	test('extra', () => {
		expect(ctx.getExtra()).toBeUndefined();
		ctx.setExtra('extra');
		expect(ctx.getExtra()).toBeUndefined();
	});
});
