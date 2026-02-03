// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { Page, Ref } from './page';

describe('Page backtop=undefined', async () => {
	let ref: Ref;
	const ct = await ComponentTester.build('Page', props => (
		<Page
			{...props}
			title="title"
			ref={el => {
				ref = el;
			}}
		>
			abc
		</Page>
	));

	test('props', () => ct.testProps());

	test('backtop=undefined', () => {
		expect(ref!.root()).not.toBeUndefined();
		expect(ref!.backtop()).not.toBeUndefined();
	});
});

describe('Page', async () => {
	let ref: Ref;
	await ComponentTester.build('Page', props => (
		<Page
			backtop={false}
			{...props}
			title="title"
			ref={el => {
				ref = el;
			}}
		>
			abc
		</Page>
	));

	test('backtop=false', async () => {
		expect(ref!.root()).not.toBeUndefined();
		expect(ref!.backtop()).toBeUndefined();
	});
});
