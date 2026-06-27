// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { type FormPopoverRef, Popover } from './popover';

describe('Popover', async () => {
	let ref: FormPopoverRef;
	const ct = await ComponentTester.build('Popover', props => (
		<Popover
			popover={() => document.querySelector('p')!}
			formatter={() => <div>formatter</div>}
			type="click"
			{...props}
			ref={el => (ref = el)}
		>
			<p>abc</p>
		</Popover>
	));

	test('props', () => ct.testProps());

	test('ref', async () => {
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
		expect(ref.popover()).toBeDefined();
		expect(ref.activator()).toBeDefined();
	});
});
