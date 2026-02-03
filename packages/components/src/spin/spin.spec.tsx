// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';
import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { Ref, Spin } from './spin';
import styles from './style.module.css';

describe('Spin', async () => {
	let ref: Ref<'div'>;
	const [spin, setSpin] = createSignal(false);
	const ct = await ComponentTester.build('Spin', props => (
		<Spin
			{...props}
			indicator="def"
			spinning={spin()}
			ref={el => {
				ref = el;
			}}
		>
			abc
		</Spin>
	));

	test('props', () => ct.testProps());

	test('preset', async () => {
		const c = ct.result.container.firstElementChild!;
		expect(c).toHaveClass(styles.spin);
		expect(c).toHaveTextContent('abc');
	});

	test('spinning', async () => {
		setSpin(true);

		const c = ct.result.container.firstElementChild!;
		expect(c).toHaveClass(styles.spin);
		expect(c).toHaveTextContent('abc');
	});

	test('ref', async () => {
		expect(ref!.root()).not.toBeUndefined();
	});
});
