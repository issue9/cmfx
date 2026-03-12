// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { FitScreen, FullScreen, type Ref } from './root';

describe('FullScreen', async () => {
	let ref: Ref;
	const ct = await ComponentTester.build('FullScreen', props => <FullScreen ref={el => (ref = el)} {...props} />);

	test('props', () => ct.testProps());
	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeDefined();
	});
});

describe('FitScreen', async () => {
	let container: HTMLDivElement;
	const ct = await ComponentTester.build('FitScreen', props => (
		<div
			ref={el => {
				container = el;
			}}
		>
			<FitScreen container={container} {...props} />
		</div>
	));

	test('props', () => ct.testProps(ct.result.container.firstElementChild!.firstElementChild!));
});
