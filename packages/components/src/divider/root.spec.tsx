// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';
import { describe, expect, test } from 'vitest';

import { joinClass } from '@components/base';
import { ComponentTester } from '@components/context/options/context.spec';
import { type Props, type Ref, Root } from './root';
import styles from './style.module.css';

describe('Divider', async () => {
	let ref: Ref;
	const [pos, setPos] = createSignal<Props['pos']>();
	const ct = await ComponentTester.build('Divider', props => (
		<Root pos={pos()} {...props} ref={el => (ref = el)}>
			abc
		</Root>
	));
	const c = ct.result.container.firstElementChild as HTMLDivElement;

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
	});

	test('pos=undefined', async () => {
		expect(c).toHaveClass(styles.divider);
		expect(c).toHaveTextContent('abc');
	});

	test('pos=end', async () => {
		setPos('end');
		expect(c).toHaveClass(joinClass(undefined, styles.divider, styles['pos-end'])!);
		expect(c).toHaveTextContent('abc');
	});

	test('pos=center', async () => {
		setPos('center');
		expect(c).toHaveClass(joinClass(undefined, styles.divider, styles['pos-center'])!);
		expect(c).toHaveTextContent('abc');
	});
});
