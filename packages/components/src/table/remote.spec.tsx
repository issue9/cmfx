// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { API, type Query } from '@cmfx/core';
import { beforeEach, describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec.tsx';
import { type Ref, Root } from './remote';

describe('RemoteTable', async () => {
	type Obj = {
		name: string;
	};

	beforeEach(() => {
		fetchMock.resetMocks();
	});

	fetchMock.mockResponseOnce('123');

	const api = await API.build(
		'id',
		sessionStorage,
		'http://localhost/base',
		'/token',
		'application/json',
		'application/json',
		'zh-CN',
	);

	let ref: Ref<Obj>;
	const ct = await ComponentTester.build('RemoteTable', props => (
		<Root<Obj, Query> {...props} path="/" columns={[]} queries={{}} ref={el => (ref = el)} rest={api} />
	));

	test('props', async () => {
		expect(ref!.root()).not.toBeUndefined();
		expect(ref!.table()).not.toBeUndefined();
		ct.testProps();
	});
});
