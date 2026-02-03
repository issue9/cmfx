// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { rand, round } from './math';

describe('rand', () => {
	test('rand', () => {
		for (let i = 0; i < 10; i++) {
			const v = rand(0, 10, 0);
			expect(v).toBeGreaterThanOrEqual(0);
			expect(v).toBeLessThanOrEqual(10);
		}
	});

	test('decimals=1', () => {
		const v = rand(0.1, 10.1, 1);
		expect(v).toBeGreaterThanOrEqual(0.1);
		expect(v).toBeLessThanOrEqual(10.1);
		const index = v.toString().lastIndexOf('.');
		expect(v.toString().substring(index).length).toBeLessThanOrEqual(2);
	});

	test('decimals=3', () => {
		const v = rand(0.1, 10.1, 3);
		expect(v).toBeGreaterThanOrEqual(0.1);
		expect(v).toBeLessThanOrEqual(10.1);
		const index = v.toString().lastIndexOf('.');
		expect(v.toString().substring(index).length).toBeLessThanOrEqual(4);
	});

	test('decimals=0', () => {
		const v = rand(1, 10, 0);
		expect(v).toBeGreaterThanOrEqual(1);
		expect(v).toBeLessThanOrEqual(10);
		const index = v.toString().lastIndexOf('.');
		expect(index).toEqual(-1);
	});
});

describe('round', () => {
	test('decimals=0', () => {
		const v = round(1.2345, 0);
		expect(v).toEqual(1);
		expect(getDecimal(v)).toEqual('');
	});

	test('decimals=1', () => {
		const v = round(1.2345, 1);
		expect(v).toEqual(1.2);
		expect(getDecimal(v)).toEqual('.2');
	});

	test('decimals=3', () => {
		const v = round(1.2345, 3);
		expect(v).toEqual(1.235);
		expect(getDecimal(v)).toEqual('.235');
	});

	test('decimals=5', () => {
		const v = round(1.2345678, 5);
		expect(v).toEqual(1.23457);
		expect(getDecimal(v)).toEqual('.23457');
	});
});

function getDecimal(v: number): string {
	const s = v.toString();
	const index = s.lastIndexOf('.');
	if (index === -1) {
		return '';
	}
	return s.substring(index);
}
