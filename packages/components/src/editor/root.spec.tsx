// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/options/context.spec';
import { Form1 } from '@components/form1/form';
import { type Ref, Root } from './root';

describe('Editor', async () => {
	let ref!: Ref;
	const fa = Form1.fieldAccessor('chk', 'string');
	const ct = await ComponentTester.build('Editor', props => <Root ref={el => (ref = el)} accessor={fa} {...props} />);

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
