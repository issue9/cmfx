// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { Button } from '@components/button/button';
import { ComponentTester } from '@components/context/options/context.spec.tsx';
import { GroupButton, type GroupButtonRef } from './root';

describe('ButtonGroup', async () => {
	let ref: GroupButtonRef;
	const ct = await ComponentTester.build('ButtonGroup', props => (
		<GroupButton ref={el => (ref = el)} {...props}>
			<Button>btn1</Button>
		</GroupButton>
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLFieldSetElement);
	});
});
