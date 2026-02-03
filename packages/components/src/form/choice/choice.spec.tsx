// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { fieldAccessor } from '@components/form/field';
import { Choice } from './choice';

describe('Choice', async () => {
	const fa = fieldAccessor('chk', '1');
	const ct = await ComponentTester.build('Choice', props => <Choice options={[]} accessor={fa} {...props} />);

	test('props', () => ct.testProps());
});
