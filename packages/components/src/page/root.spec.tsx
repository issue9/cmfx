// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { createTester } from '@components/context/options/context.spec';
import { type PageRef, Root } from './root';

describe('Page backtop=undefined', async () => {
	let ref: PageRef;
	const ct = await createTester('Page', props => (
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
	let ref: PageRef;
	await createTester('Page', props => (
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
	let ref: PageRef;
	await createTester('Page', props => (
		<Root backTop={{ rounded: true }} {...props} title="title" ref={el => (ref = el)}>
			abc
		</Root>
	));

	test('ref', async () => {
		expect(ref!.root()).toBeDefined();
		expect(ref!.backTop()).toBeDefined();
	});
});
