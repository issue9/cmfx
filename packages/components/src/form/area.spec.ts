// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { JSX } from 'solid-js';
import { describe, expect, test } from 'vitest';

import type { Areas } from './area';
import { area2Style, calcAreas } from './area';

describe('area2Style', () => {
	test('pos', () => {
		expect(area2Style({ pos: 'top-start' })).toEqual<JSX.CSSProperties>({ 'grid-area': 'top-start' });
	});

	test('pos-cols', () => {
		expect(area2Style({ pos: 'top-start', cols: 2 })).toEqual<JSX.CSSProperties>({
			'grid-area': 'top-start',
			'grid-column-end': 'span 2',
		});
	});

	test('pos-cols-rows', () => {
		expect(area2Style({ pos: 'top-start', cols: 2, rows: 3 })).toEqual<JSX.CSSProperties>({
			'grid-area': 'top-start',
			'grid-column-end': 'span 2',
			'grid-row-end': 'span 3',
		});
	});

	test('pos-rows', () => {
		expect(area2Style({ pos: 'top-start', rows: 3 })).toEqual<JSX.CSSProperties>({
			'grid-area': 'top-start',
			'grid-row-end': 'span 3',
		});
	});
});

describe('calcAreas', () => {
	test('horizontal', () => {
		expect(calcAreas('horizontal')).toEqual<Areas>({
			label: { pos: 'top-start', rows: 2 },
			input: { pos: 'top-center', cols: 2, rows: 2 },
			help: { pos: 'bottom-center' },
			extra: { pos: 'bottom-end' },
		});
	});

	test('vertical', () => {
		expect(calcAreas('vertical')).toEqual<Areas>({
			label: { pos: 'top-start', cols: 2 },
			input: { pos: 'middle-start', cols: 3 },
			help: { pos: 'bottom-start', cols: 3 },
			extra: { pos: 'top-end' },
		});
	});
});
