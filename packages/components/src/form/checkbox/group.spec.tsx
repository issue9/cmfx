// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { fieldAccessor } from '@components/form/field';
import { CheckboxGroup } from './group';

describe('CheckboxGroup', async () => {
	const fa = fieldAccessor('chk', ['1']);
	const ct = await ComponentTester.build('CheckboxGroup', props => (
		<CheckboxGroup options={[]} accessor={fa} {...props} />
	));

	test('props', () => ct.testProps());
});
