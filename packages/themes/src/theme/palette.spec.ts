// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { palette, palettes } from './palette';
import { classList } from './props';

test('classList', () => {
	expect(classList()).toBeUndefined();
	expect(classList(undefined, {})).toBeUndefined();
	expect(classList(undefined, undefined, '')).toBeUndefined();
	expect(classList(undefined, undefined, '', null)).toBeUndefined();
	expect(classList(undefined, undefined, '', '')).toBeUndefined();
	expect(classList(undefined, {}, '')).toBeUndefined();

	expect(classList('error', { a: true, b: false, c: undefined, d: true })).toEqual('palette--error a d');
	expect(classList(undefined, { a: true, b: false, c: undefined, d: true }, 'abc', 'def')).toEqual('a d abc def');
	expect(classList(undefined, { a: true, b: false, c: undefined, d: true }, 'abc', 'def', '')).toEqual('a d abc def');
	expect(classList('surface', { a: true, b: false, c: undefined, d: true }, 'abc', 'def', undefined)).toEqual(
		'palette--surface a d abc def',
	);
});

describe('palette', () => {
	const parent = document.createElement('div');
	parent.classList.add('palette--primary');
	document.body.appendChild(parent);

	const child = document.createElement('div');
	child.classList.add('palette--error');
	parent.appendChild(child);

	test('next=0', () => {
		expect(palette(parent)).toEqual('primary');
		expect(palette(child)).toEqual('error');
	});

	test('next=3', () => {
		expect(palette(parent, 3)).toEqual('error');
		expect(palette(child, 3)).toEqual('secondary');
	});

	test('next=palettes.length', () => {
		expect(palette(parent, palettes.length)).toEqual('primary');
		expect(palette(child, palettes.length)).toEqual('error');
	});

	test('next=palettes.length+2', () => {
		expect(palette(parent, palettes.length + 2)).toEqual('tertiary');
		expect(palette(child, palettes.length + 2)).toEqual('primary');
	});
});
