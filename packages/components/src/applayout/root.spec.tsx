// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { AppLayout, type AppLayoutRef } from './root';

describe('AppLayout.horizontal', async () => {
	let ref: AppLayoutRef;
	const ct = await ComponentTester.build('AppLayout.horizontal', props => (
		<AppLayout {...props} layout="horizontal" ref={el => (ref = el)}>
			abc
		</AppLayout>
	));

	test('props', async () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeDefined();
	});
});

describe('AppLayout.vertical', async () => {
	let ref: AppLayoutRef;
	const ct = await ComponentTester.build('AppLayout.vertical', props => (
		<AppLayout {...props} layout="vertical" ref={el => (ref = el)}>
			abc
		</AppLayout>
	));

	test('props', async () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeDefined();
	});
});
