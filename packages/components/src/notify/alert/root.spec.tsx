// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { Alert, type AlertRef } from './root';

describe('Alert', async () => {
	let ref: AlertRef;
	// type 会重定义 palette，success 对应的是 `ComponentTester.testProps` 中的 primary
	const ct = await ComponentTester.build('Alert', props => (
		<Alert ref={el => (ref = el)} title="alert" {...props} type="success" />
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref!.root()).toBeInstanceOf(HTMLDivElement);
	});
});
