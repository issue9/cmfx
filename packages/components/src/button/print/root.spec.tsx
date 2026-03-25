// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { type Ref, Root } from './root';

describe('PrintButton', async () => {
	let ref: Ref;
	let html!: HTMLElement;
	const ct = await ComponentTester.build('PrintButton', props => (
		<div>
			<div>elem</div>
			<Root {...props} element={() => html} ref={el => (ref = el)} />
		</div>
	));

	test('props', async () => ct.testProps());

	test('ref', () => {
		expect(ref!.root()).toBeDefined();
	});
});
