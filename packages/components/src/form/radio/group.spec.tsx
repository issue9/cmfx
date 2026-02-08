// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { fieldAccessor } from '@components/form/field';
import { RadioGroup } from './group';

describe('RadioGroup', async () => {
	const fa = fieldAccessor('chk', '1');
	const ct = await ComponentTester.build('RadioGroup', props => <RadioGroup options={[]} accessor={fa} {...props} />);

	test('props', () => ct.testProps());
	test('role', () => {
		const root = ct.result.container.firstElementChild!;
		expect(root).toHaveProperty('role', 'radiogroup');
	});
});
