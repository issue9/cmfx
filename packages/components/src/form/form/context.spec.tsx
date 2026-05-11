// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { renderHook } from '@solidjs/testing-library';
import type { ParentProps } from 'solid-js';
import { afterAll, describe, expect, test } from 'vitest';

import { API } from '@components/form/api';
import { FormProvider, useForm } from './context';

type Obj = {
	age: number;
	name: string;
};

describe('FormProvider', async () => {
	const api = new API<Obj>({ initValue: { age: 20, name: 'f2' } });

	const { result, cleanup } = renderHook(() => useForm<Obj>(), {
		wrapper: (props: ParentProps) => (
			<FormProvider id="id" api={api}>
				{props.children}
			</FormProvider>
		),
	});

	test('useForm', () => {
		expect(result?.id).toEqual('id');
	});

	afterAll(cleanup);
});
