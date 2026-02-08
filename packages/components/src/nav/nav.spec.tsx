// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { default as Nav, Ref } from './nav';

describe('Nav', async () => {
	let ref: Ref;
	let articleRef: HTMLElement;

	const ct = await ComponentTester.build('Nav', props => (
		<div>
			<article
				ref={el => {
					articleRef = el;
				}}
			>
				<h1>head1</h1>
				<h2>head2</h2>
			</article>
			<Nav
				{...props}
				target={articleRef}
				ref={el => {
					ref = el;
				}}
			/>
		</div>
	));

	test('ref', () => {
		expect(ref!.root()).not.toBeUndefined();
	});

	// 组件包含在一个 Div 中
	const root = ct.result.container.firstElementChild!.children[1];
	test('props', () => ct.testProps(root));
});
