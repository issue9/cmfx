// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import userEvent from '@testing-library/user-event';
import { createSignal } from 'solid-js';
import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { EditorComponent, type EditorRef } from './root';

describe('Editor', async () => {
	let ref!: EditorRef;
	const [value, setValue] = createSignal('string');
	const ct = await ComponentTester.build('Editor', props => (
		<EditorComponent ref={el => (ref = el)} value={value()} onChange={setValue} {...props} />
	));

	test('props', () => ct.testProps());

	test('ref', () => {
		expect(ref).toBeDefined();
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
		expect(ref.editor()).toBeDefined();
	});

	test('type', async () => {
		const user = userEvent.setup();
		await user.type(ref.root().querySelector('.tiptap') as HTMLElement, 'caixw');
		expect(ref.editor().getHTML()).toContain('caixw');
	});
});
