// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { renderHook } from '@solidjs/testing-library';
import type { ParentProps } from 'solid-js';
import { afterAll, describe, expect, test } from 'vitest';

import { FormProvider } from '@cdk/form/form';
import { Provider } from '@cdk/testenv/testenv';
import { FormFieldProvider, useFormField } from './provider';

type Obj = {
	age: number;
	name?: string;
};

describe('FieldProvider', async () => {
	test('useFormField.age', () => {
		const { result, cleanup } = renderHook(() => useFormField<Obj>(), {
			wrapper: (props: ParentProps) => {
				return (
					<Provider>
						<FormProvider<Obj> initValue={{ age: 20 }}>
							<FormFieldProvider<Obj> name="age">{props.children}</FormFieldProvider>
						</FormProvider>
					</Provider>
				);
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

	test('useFormField.name', () => {
		const { result, cleanup } = renderHook(() => useFormField<Obj>(), {
			wrapper: (props: ParentProps) => {
				return (
					<Provider>
						<FormProvider<Obj> initValue={{ age: 20 }}>
							<FormFieldProvider<Obj> name="name">{props.children}</FormFieldProvider>
							<FormFieldProvider isolation>isolation</FormFieldProvider>
						</FormProvider>
					</Provider>
				);
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

	test('isolation', () => {
		const { result, cleanup } = renderHook(() => useFormField<Obj>(), {
			wrapper: (props: ParentProps) => {
				return (
					<Provider>
						<FormProvider<Obj> initValue={{ name: 'f1', age: 20 }}>
							<FormFieldProvider<Obj> name="age">
								<FormFieldProvider isolation>{props.children}</FormFieldProvider>
							</FormFieldProvider>
						</FormProvider>
					</Provider>
				);
			},
		});

		expect(result).toBeUndefined();

		afterAll(cleanup);
	});

	test('useFormField.conv', () => {
		const { result, cleanup } = renderHook(
			() =>
				useFormField<Obj, string>({
					from(t) {
						return t?.toString();
					},
					to(t) {
						return t;
					},
				}),
			{
				wrapper: (props: ParentProps) => {
					return (
						<Provider>
							<FormProvider<Obj> initValue={{ name: 'f1', age: 20 }}>
								<FormFieldProvider<Obj> name="age">{props.children}</FormFieldProvider>
							</FormProvider>
						</Provider>
					);
				},
			},
		);

		expect(result).toBeDefined();
		expect(result?.getValue(), '20');
		result?.setValue('21');
		expect(result?.getValue(), '21');

		afterAll(cleanup);
	});
});
