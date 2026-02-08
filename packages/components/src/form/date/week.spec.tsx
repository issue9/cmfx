// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { WeekValueType } from '@components/datetime';
import { fieldAccessor } from '@components/form/field';
import { WeekPicker } from './week';

describe('WeekPicker', async () => {
	const fa = fieldAccessor<WeekValueType>('chk', [2025, 13]);
	const ct = await ComponentTester.build('WeekPicker', props => <WeekPicker accessor={fa} {...props} />);

	test('props', () => ct.testProps());
});
