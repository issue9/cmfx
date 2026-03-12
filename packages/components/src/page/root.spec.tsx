// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { type Ref, Root } from './root';

describe('Page backtop=undefined', async () => {
	let ref: Ref;
	const ct = await ComponentTester.build('Page', props => (
		<Root
			{...props}
			title="title"
			ref={el => {
				ref = el;
			}}
		>
			abc
		</Root>
	));

	test('props', () => ct.testProps());

	test('backtop=undefined', () => {
		expect(ref!.root()).not.toBeUndefined();
		expect(ref!.backTop()).not.toBeUndefined();
	});
});

describe('Page', async () => {
	let ref: Ref;
	await ComponentTester.build('Page', props => (
		<Root
			backTop={false}
			{...props}
			title="title"
			ref={el => {
				ref = el;
			}}
		>
			abc
		</Root>
	));

	test('backtop=false', async () => {
		expect(ref!.root()).not.toBeUndefined();
		expect(ref!.backTop()).toBeUndefined();
	});
});
