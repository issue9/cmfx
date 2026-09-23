// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { FormContext } from '@cmfx/cdk';
import { renderHook } from '@solidjs/testing-library';
import { afterAll, describe, expect, test } from 'vitest';

import { createTester, initTestEnv, Provider } from '@components/context/options/context.spec';
import { Form, type FormRef } from '@components/form/form';
import { String2DateConverter } from './convert';
import { Field, type FormFieldRef, useField } from './field';

describe('Field', async () => {
	let ref: FormFieldRef;
	const ct = await createTester('Color.Panel', props => <Field ref={el => (ref = el)} {...props} />);

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
	});

	test('notInForm', () => {
		const { result, cleanup } = renderHook(() => useField(), {
			wrapper: props => <Field label="label">{props.children}</Field>,
		});

		expect(result).toBeDefined();
		expect(result?.api.inForm).toBeFalsy();
		expect(result?.fieldRef).toBeDefined();

		expect(result?.api.getValue()).toBeUndefined();
		result?.api.setValue(5);
		expect(result?.api.getValue()).toEqual(5);

		afterAll(cleanup);
	});

	test('inForm', async () => {
		const o = await initTestEnv();
		const obj = { age: 5, name: 'name' };
		let formRef!: FormRef<typeof obj>;

		const { result, cleanup } = renderHook(() => useField(), {
			wrapper: props => (
				<Provider {...o}>
					<Form initValue={obj} ref={el => (formRef = el)}>
						<Field<typeof obj> label="label" name="age">
							{props.children}
						</Field>
					</Form>
				</Provider>
			),
		});

		expect(result).toBeDefined();
		expect(result?.api.inForm).toBe(true);
		expect(result?.api.getValue()).toEqual(5);
		expect(result?.fieldRef).toBeDefined();

		formRef.api().setValue({ age: 6, name: '6' });
		expect(result?.api.getValue()).toEqual(6);

		afterAll(cleanup);
	});

	test('inForm-conv', async () => {
		const o = await initTestEnv();
		const obj = { biritday: '1970-01-02', name: 'name' };
		const api = new FormContext({ initValue: obj });

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
		expect(result?.api.inForm).toBe(true);
		expect(result?.api.getValue()).toEqual(new Date('1970-01-02'));
		expect(result?.fieldRef).toBeDefined();

		api.setValue({ biritday: '1980-01-02', name: '6' });
		expect(result?.api.getValue()).toEqual(new Date('1980-01-02'));

		afterAll(cleanup);
	});
});
