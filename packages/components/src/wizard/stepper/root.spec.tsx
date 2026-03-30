// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { type Ref, Root, type Step } from './root';

const steps: Array<Step> = [
	{ title: 'Step 1', content: 'Content for Step 1' },
	{ title: 'Step 2222222', content: 'Content for Step 2' },
	{ title: 'Step 3', content: 'Content for Step 3' },
] as const;

describe('Stepper', async () => {
	let ref: Ref;
	const ct = await ComponentTester.build('Stepper', props => <Root ref={el => (ref = el)} steps={steps} {...props} />);

	test('props', () => ct.testProps());
	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
	});
});
