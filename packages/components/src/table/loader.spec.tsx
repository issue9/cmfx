// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Query } from '@cmfx/core';
import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { type Ref, Root } from './loader';

describe('LoaderTable', async () => {
	let ref: Ref<object>;
	const ct = await ComponentTester.build('LoaderTable', props => (
		<Root<object, Query>
			{...props}
			load={async (_: Query): Promise<object[]> => {
				return [];
			}}
			columns={[]}
			queries={{}}
			ref={el => {
				ref = el;
			}}
		/>
	));

	test('props', async () => ct.testProps());

	test('ref', async () => {
		expect(ref!.root()).not.toBeUndefined();
		expect(ref!.table()).not.toBeUndefined();
	});
});
