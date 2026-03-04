// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { fieldAccessor } from '@components/form/field';
import { Album, Ref } from './album';

describe('Album', async () => {
	let ref: Ref;
	const fa = fieldAccessor('tf', ['url']);
	const ct = await ComponentTester.build('Album', props => (
		<Album fieldName="file" upload={async () => []} accessor={fa} {...props} ref={el => (ref = el)} />
	));

	test('props', () => ct.testProps());

	test('ref', async () => {
		expect(ref.root()).toBeInstanceOf(HTMLDivElement);
		expect(ref.uploader()).toBeDefined();
	});
});
