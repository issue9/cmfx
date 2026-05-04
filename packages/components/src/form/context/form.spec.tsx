// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { FlattenKeys } from '@cmfx/core';
import { renderHook } from '@solidjs/testing-library';
import type { ParentProps } from 'solid-js';
import { afterAll, describe, expect, test } from 'vitest';

import { API } from '@components/form/api';
import { buildFieldContext } from './field';
import { FormProvider, useForm } from './form';

type Obj = {
	age: number;
	name: string;
};

describe('FormProvider', async () => {
	const api = new API<Obj>({ initValue: { age: 20, name: 'f2' } });

	const { result, cleanup } = renderHook(() => useForm<Obj>(), {
		wrapper: (props: ParentProps) => (
			<FormProvider id="id" createField={(id, key: FlattenKeys<Obj>) => buildFieldContext<Obj>(id, key, api)}>
				{props.children}
			</FormProvider>
		),
	});

	test('useForm', () => {
		expect(result?.id).toEqual('id');
	});

	afterAll(cleanup);
});
