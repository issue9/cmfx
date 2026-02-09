// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { fieldAccessor } from '@components/form/field';
import { default as DateRangePicker } from './range';

describe('DateRangePicker', async () => {
	const fa = fieldAccessor<[Date, Date], 'date'>('chk', [new Date(), new Date()], 'date');
	const ct = await ComponentTester.build('DateRangePicker', props => <DateRangePicker accessor={fa} {...props} />);

	test('props', () => ct.testProps());
});
