// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { default as TimePanel } from './timepanel';

describe('TimePanel', async () => {
	const ct = await ComponentTester.build('TimePanel', props => <TimePanel {...props} />);

	test('props', async () => {
		ct.testProps();
	});
});
