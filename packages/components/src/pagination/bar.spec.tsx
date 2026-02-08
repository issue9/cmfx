// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { PaginationBar } from './bar';

describe('PaginationBar', async () => {
	const ct = await ComponentTester.build('PaginationBar', props => <PaginationBar total={20} page={1} {...props} />);

	test('props', () => ct.testProps());
});
