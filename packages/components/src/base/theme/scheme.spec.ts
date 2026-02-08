// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { readScheme, Scheme, writeScheme } from './scheme';

test('Scheme', () => {
	const parent = document.createElement('div');
	const child1 = document.createElement('div');
	const child2 = document.createElement('div');
	parent.appendChild(child1);
	child1.appendChild(child2);

	writeScheme(parent, { primary: '#000' } as Scheme);
	writeScheme(child1, { primary: '#111' } as Scheme);
	writeScheme(child2);

	expect(readScheme(parent).primary).toEqual('#000');
	expect(readScheme(child1).primary).toEqual('#111');
	expect(readScheme(child2).primary).toBeFalsy();
});
