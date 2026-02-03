// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { fieldAccessor } from '@components/form/field';
import { Album } from './album';

describe('Album', async () => {
	const fa = fieldAccessor('tf', ['url']);
	const ct = await ComponentTester.build('Album', props => (
		<Album fieldName="file" upload={async () => []} accessor={fa} {...props} />
	));

	test('prorps', () => ct.testProps());
});
