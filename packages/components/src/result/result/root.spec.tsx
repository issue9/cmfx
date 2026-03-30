// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { type Ref, Root } from './root';
import styles from './style.module.css';

describe('Result', async () => {
	let ref: Ref;
	const ct = await ComponentTester.build('Result', props => (
		<Root ref={el => (ref = el)} title="title" {...props}>
			abc
		</Root>
	));

	test('title', async () => {
		const c = ct.result.container.firstElementChild!;
		expect(c).toHaveClass(styles.result);
		expect(c).toHaveTextContent('abc');
	});

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
	});
});
