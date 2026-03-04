// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';
import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { Badge, Corner, Ref } from './badge';
import styles from './style.module.css';

describe('Badge', async () => {
	let ref: Ref;
	const [pos, setPos] = createSignal<Corner>();
	const ct = await ComponentTester.build('Badge', props => (
		<Badge ref={el => (ref = el)} pos={pos()} content="text" {...props}>
			abc
		</Badge>
	));

	test('props', async () => {
		const root = ct.result.container.firstChild;
		ct.testProps(root!.lastChild as Element);
	});

	test('ref', async () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
	});

	test('pos=undefined', async () => {
		const c = ct.result.container.firstElementChild!;

		expect(c).toHaveClass(styles.badge);
		expect(c).toHaveTextContent('abc');

		const span = c.lastChild;
		expect(span).toHaveTextContent('text');
		expect(span).toHaveClass(styles.point);
		expect(span).toHaveClass(styles.topright);
	});

	test('pos=bottomleft', async () => {
		setPos('bottomleft');

		const c = ct.result.container.firstElementChild!;

		expect(c).toHaveClass(styles.badge);
		expect(c).toHaveTextContent('abc');

		const span = c.lastChild;
		expect(span).toHaveTextContent('text');
		expect(span).toHaveClass(styles.point);
		expect(span).toHaveClass(styles.bottomleft);
	});
});
