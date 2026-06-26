// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { renderHook } from '@solidjs/testing-library';
import { afterAll, describe, expect, test } from 'vitest';

import { ComponentTester, initTestEnv, Provider } from '@components/context/options/context.spec';
import { API } from '@components/form/api';
import { Form } from '@components/form/form';
import { type FormFieldRef, useField } from './context';
import { String2DateConverter } from './convert';
import { Field } from './field';

describe('Field', async () => {
	let ref: FormFieldRef;
	const ct = await ComponentTester.build('Color.Panel', props => <Field ref={el => (ref = el)} {...props} />);

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
	});

	test('notInForm', () => {
		const { result, cleanup } = renderHook(() => useField({ value: 5 }), {
			wrapper: props => <Field label="label">{props.children}</Field>,
		});

		expect(result).toBeDefined();
		expect(result?.inForm).toBeFalsy();
		expect(result?.getValue()).toEqual(5);
		expect(result?.fieldRef).toBeDefined();

		afterAll(cleanup);
	});

	test('inForm', async () => {
		const o = await initTestEnv();
		const obj = { age: 5, name: 'name' };
		const api = new API({ initValue: obj });

		const { result, cleanup } = renderHook(() => useField(), {
			wrapper: props => (
				<Provider {...o}>
					<Form api={api}>
						<Field<typeof obj> label="label" name="age">
							{props.children}
						</Field>
					</Form>
				</Provider>
			),
		});

		expect(result).toBeDefined();
		expect(result?.inForm).toBe(true);
		expect(result?.getValue()).toEqual(5);
		expect(result?.fieldRef).toBeDefined();

		api.setValue({ age: 6, name: '6' });
		expect(result?.getValue()).toEqual(6);

		afterAll(cleanup);
	});

	test('inForm-conv', async () => {
		const o = await initTestEnv();
		const obj = { biritday: '1970-01-02', name: 'name' };
		const api = new API({ initValue: obj });

		const { result, cleanup } = renderHook(() => useField<Date>(), {
			wrapper: props => (
				<Provider {...o}>
					<Form api={api}>
						<Field<typeof obj, Date> label="label" name="biritday" conv={new String2DateConverter()}>
							{props.children}
						</Field>
					</Form>
				</Provider>
			),
		});

		expect(result).toBeDefined();
		expect(result?.inForm).toBe(true);
		expect(result?.getValue()).toEqual(new Date('1970-01-02'));
		expect(result?.fieldRef).toBeDefined();

		api.setValue({ biritday: '1980-01-02', name: '6' });
		expect(result?.getValue()).toEqual(new Date('1980-01-02'));

		afterAll(cleanup);
	});
});
