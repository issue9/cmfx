// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { type Ref, Root } from './root';

describe('ChartPie', async () => {
	let ref: Ref;
	const ct = await ComponentTester.build('ChartAxis', props => (
		<Root
			ref={el => (ref = el)}
			{...props}
			legend="left"
			radius={['30%', '50%']}
			padding={5}
			borderRadius={5}
			initValue={[
				{ name: 'aaa', value: 80, selected: true },
				{ name: 'bbb', value: 180 },
			]}
		/>
	));

	test('props', () => ct.testProps());

	test('ref', async () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
	});
});
