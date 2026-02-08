// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { fieldAccessor } from '@components/form/field';
import { default as Time } from './time';

describe('Time', async () => {
	const fa = fieldAccessor('tf', new Date());
	const ct = await ComponentTester.build('Time', props => <Time accessor={fa} {...props} />);

	test('prorps', () => ct.testProps());
});
