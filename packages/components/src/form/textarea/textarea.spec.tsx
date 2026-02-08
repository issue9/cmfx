// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { fieldAccessor } from '@components/form/field';
import { TextArea } from './textarea';

describe('TextArea', async () => {
	const fa = fieldAccessor('tf', 'textarea');
	const ct = await ComponentTester.build('TextArea', props => <TextArea accessor={fa} {...props} />);

	test('props', () => ct.testProps());
});
