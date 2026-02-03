// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { default as Appbar, Ref } from './appbar';

describe('Appbar', async () => {
	let ref: Ref;
	const ct = await ComponentTester.build('Appbar', props => (
		<Appbar
			title="title"
			{...props}
			ref={r => {
				ref = r;
			}}
		>
			abc
		</Appbar>
	));

	test('props', async () => {
		const root = ct.result.container.firstElementChild!;
		expect(root).toHaveProperty('role', 'toolbar');
		ct.testProps();
	});

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeDefined();
	});
});
