// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { fieldAccessor } from '@components/form/field';
import { DatePicker } from './date';

describe('DatePicker', async () => {
	const fa = fieldAccessor<Date, 'number'>('chk', new Date());
	const ct = await ComponentTester.build('DatePicker', props => <DatePicker accessor={fa} {...props} />);

	test('props', () => ct.testProps());
});
