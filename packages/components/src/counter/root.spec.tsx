// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { Root } from './root';

describe('Counter', async () => {
	const ct = await ComponentTester.build('Counter', props => <Root value={10} {...props} />);

	test('props', () => ct.testProps());
});
