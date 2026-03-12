// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { type Option, type Ref, Root } from './root';

describe('Chart', async () => {
	const x = [1, 2, 3, 4, 5, 6, 7];
	const s1 = [15, 23, 22, 21, 13, 14, 26];
	const s2 = [10, 20, 24, 28, 15, 17, 20];

	const opt: Option = {
		title: { show: false },
		xAxis: {
			type: 'category',
			data: x,
		},
		yAxis: {
			type: 'value',
		},
		series: [
			{
				data: s1,
				type: 'line',
			},
			{
				data: s2,
				type: 'bar',
			},
		],
	};

	let ref: Ref;
	const ct = await ComponentTester.build('Chart', props => (
		<Root
			ref={el => {
				ref = el;
			}}
			initValue={opt}
			{...props}
		/>
	));

	test('props', async () => {
		ct.testProps();
	});

	test('ref', async () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
		expect(ref.echarts()).toBeDefined();
	});
});
