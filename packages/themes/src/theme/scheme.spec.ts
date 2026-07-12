// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { readScheme, type Scheme, writeScheme } from './scheme';

describe('Scheme', () => {
	const parent = document.createElement('div');
	const child1 = document.createElement('div');
	const child2 = document.createElement('div');
	parent.appendChild(child1);
	child1.appendChild(child2);

	test('writeScheme', () => {
		writeScheme(parent, { primary: '#000', vars: { '--color': 'red' } } as unknown as Scheme);
		writeScheme(child1, { primary: '#111', vars: { '--color': 'green' } } as unknown as Scheme);
		writeScheme(child2);
	});

	test('readScheme', () => {
		const ps = readScheme(parent);
		expect(ps.primary).toEqual('#000');
		expect(ps.vars?.['--color']).toEqual('red');

		const cs1 = readScheme(child1);
		expect(cs1.primary).toEqual('#111');
		expect(cs1.vars?.['--color']).toEqual('green');

		const cs2 = readScheme(child2);
		expect(cs2.primary).toBeFalsy();
		expect(cs2.vars).toStrictEqual({});
	});
});
