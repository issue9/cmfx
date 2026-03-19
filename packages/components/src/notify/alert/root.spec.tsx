// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { Root } from './root';

describe('Alert', async () => {
	// type 会重定义 palette，success 对应的是 `ComponentTester.testProps` 中的 primary
	const ct = await ComponentTester.build('Alert', props => <Root title="alert" {...props} type="success" />);

	test('props', () => ct.testProps());
});
