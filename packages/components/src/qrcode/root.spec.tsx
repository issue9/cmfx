// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { type Ref, Root } from './root';
import styles from './style.module.css';

describe('QRCode', async () => {
	let ref: Ref;
	const ct = await ComponentTester.build('QRCode', props => (
		<Root
			{...props}
			ref={el => {
				ref = el;
			}}
			cornerDotType="square"
			errorCorrectionLevel="L"
			cornerSquareType="dots"
			value="123"
		/>
	));

	test('qrcode', async () => {
		const c = ct.result.container.firstElementChild;
		expect(c).toHaveClass(styles.qrcode);
	});

	test('ref', async () => {
		expect(ref!.root()).not.toBeUndefined();
		expect(ref!.qrCodeStyling()).not.toBeUndefined();
	});

	test('props', () => ct.testProps());
});
