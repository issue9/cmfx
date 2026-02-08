// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';
import { describe, expect, test } from 'vitest';

import { joinClass } from '@components/base';
import { ComponentTester } from '@components/context/context.spec';
import { Divider, Props } from './divider';
import styles from './style.module.css';

describe('Divider', async () => {
	const [pos, setPos] = createSignal<Props['pos']>();
	const ct = await ComponentTester.build('Divider', props => (
		<Divider pos={pos()} {...props}>
			abc
		</Divider>
	));
	const c = ct.result.container.firstElementChild as HTMLDivElement;

	test('props', () => {
		ct.testProps();
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
