// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { renderHook } from '@solidjs/testing-library';
import { createSignal, type ParentProps } from 'solid-js';
import { afterAll, describe, expect, test } from 'vitest';

import { API } from '@components/form/api';
import { createFakeField, FieldProvider, useField } from './context';

type Obj = {
	age: number;
	name?: string;
};

describe('FieldProvider', async () => {
	const api = new API<Obj>({ initValue: { age: 20 } });

	test('isolation.undefined', () => {
		const { result, cleanup } = renderHook(() => useField<number>(), {
			wrapper: (props: ParentProps) => {
				const f = api.createFieldAccessor('age');
				return (
					<FieldProvider {...f}>
						<FieldProvider isolation>{props.children}</FieldProvider>
					</FieldProvider>
				);
			},
		});

		expect(result).toBeUndefined();

		afterAll(cleanup);
	});

	test('isolation.props', () => {
		const [val, setVal] = createSignal(5);
		const { result, cleanup } = renderHook(() => useField<number>({ value: val(), onChange: setVal }, true), {
			wrapper: (props: ParentProps) => {
				const f = api.createFieldAccessor('age');
				return (
					<FieldProvider {...f}>
						<FieldProvider isolation>{props.children}</FieldProvider>
					</FieldProvider>
				);
			},
		});

		expect(result).toBeDefined();
		expect(result.inForm).toBeFalsy();

		afterAll(cleanup);
	});

	test('useField.age', () => {
		const { result, cleanup } = renderHook(() => useField<number>(), {
			wrapper: (props: ParentProps) => {
				const f = api.createFieldAccessor('age');
				return <FieldProvider {...f}>{props.children}</FieldProvider>;
			},
		});

		expect(result).toBeDefined();
		expect(result?.inForm).toBe(true);

		expect(result?.id).toBeDefined();
		expect(result?.name).toEqual('age');

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

		afterAll(cleanup);
	});

	test('useField.name', () => {
		const { result, cleanup } = renderHook(() => useField<string>(), {
			wrapper: (props: ParentProps) => {
				const f = api.createFieldAccessor('name');
				return <FieldProvider {...f}>{props.children}</FieldProvider>;
			},
		});

		expect(result).toBeDefined();

		expect(result?.id).toBeDefined();
		expect(result?.name).toEqual('name');

		expect(result?.getValue()).toBeUndefined();
		result?.setValue('f2');
		expect(result?.getValue()).toEqual('f2');

		result?.reset();
		expect(result?.getValue()).toBeUndefined();

		afterAll(cleanup);
	});
});

describe('createFakeField', () => {
	const ctx = createFakeField(20);

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
		expect(ctx.getError()).toBeUndefined();
	});
});
