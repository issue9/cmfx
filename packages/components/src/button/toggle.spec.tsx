// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { Ref, ToggleFitScreenButton, ToggleFullScreenButton } from './toggle';

describe('ToggleFullScreenButton', async () => {
	let ref: Ref;
	const ct = await ComponentTester.build('ToggleFullScreenButton', props => (
		<ToggleFullScreenButton ref={el => (ref = el)} {...props} />
	));

	test('props', () => ct.testProps());
	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeDefined();
	});
});

describe('ToggleFitScreenButton', async () => {
	let container: HTMLDivElement;
	const ct = await ComponentTester.build('ToggleFitScreenButton', props => (
		<div
			ref={el => {
				container = el;
			}}
		>
			<ToggleFitScreenButton container={container} {...props} />
		</div>
	));

	test('props', () => ct.testProps(ct.result.container.firstElementChild!.firstElementChild!));
});
