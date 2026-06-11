// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { PrintButton, type PrintButtonRef } from './root';

describe('PrintButton', async () => {
	let ref: PrintButtonRef;
	let html!: HTMLElement;
	const ct = await ComponentTester.build('PrintButton', props => (
		<>
			<PrintButton {...props} element={() => html} ref={el => (ref = el)} />
			<div>elem</div>
		</>
	));

	test('props', async () => ct.testProps());

	test('ref', () => {
		expect(ref!.root()).toBeDefined();
	});
});
