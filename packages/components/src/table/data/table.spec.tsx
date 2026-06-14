// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Query } from '@cmfx/core';
import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { DataTable, type DataTableRef } from './table';

describe('DataTable', async () => {
	let ref: DataTableRef<object>;
	const ct = await ComponentTester.build('DataTable', props => (
		<DataTable<object, Query>
			{...props}
			load={async (_: Query): Promise<object[]> => {
				return [];
			}}
			columns={[]}
			ref={el => (ref = el)}
		/>
	));

	test('props', async () => ct.testProps());

	test('ref', async () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
		expect(ref.table()).toBeDefined();
		expect(ref.items()).toBeDefined();
	});
});
