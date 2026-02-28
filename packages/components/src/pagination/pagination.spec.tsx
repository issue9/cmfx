// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { Pagination } from './pagination';

describe('pagination', async () => {
	const user = userEvent.setup();
	let curr: number;

	const ct = await ComponentTester.build('Pagination', props => (
		<Pagination
			count={5}
			value={3}
			onChange={val => {
				curr = val;
			}}
			{...props}
		/>
	));

	test('props', () => ct.testProps());

	test('click & hover', async () => {
		const c = ct.result.container.firstElementChild!;

		await user.click(c.firstChild as HTMLElement);
		expect(curr!).toEqual(1);

		await user.click(c.lastChild as HTMLElement);
		expect(curr!).toEqual(5);
	});
});
