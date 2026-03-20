// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { type Ref, Root } from './root';

describe('Page backtop=undefined', async () => {
	let ref: Ref;
	const ct = await ComponentTester.build('Page', props => (
		<Root {...props} title="title" ref={el => (ref = el)}>
			abc
		</Root>
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref!.root()).toBeDefined();
		expect(ref!.backTop()).toBeDefined();
	});
});

describe('Page backtop=false', async () => {
	let ref: Ref;
	await ComponentTester.build('Page', props => (
		<Root backTop={false} {...props} title="title" ref={el => (ref = el)}>
			abc
		</Root>
	));

	test('ref', async () => {
		expect(ref!.root()).toBeDefined();
		expect(ref!.backTop()).toBeUndefined();
	});
});

describe('Page backtop=custom', async () => {
	let ref: Ref;
	await ComponentTester.build('Page', props => (
		<Root backTop={{ rounded: true }} {...props} title="title" ref={el => (ref = el)}>
			abc
		</Root>
	));

	test('ref', async () => {
		expect(ref!.root()).toBeDefined();
		expect(ref!.backTop()).toBeDefined();
	});
});
