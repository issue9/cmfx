// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { createTester } from '@components/context/options/context.spec.tsx';
import { Album, type AlbumRef } from './root.tsx';

describe('Album', async () => {
	let ref: AlbumRef;
	const ct = await createTester('Album', props => (
		<Album fieldName="file" upload={async () => []} {...props} ref={el => (ref = el)} />
	));

	test('props', () => ct.testProps());

	test('ref', async () => {
		expect(ref.root()).toBeInstanceOf(HTMLFieldSetElement);
		expect(ref.uploader()).toBeDefined();
	});
});
