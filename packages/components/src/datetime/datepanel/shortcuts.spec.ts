// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { nextQuarter, nextYear, prevMonth, prevQuarter, prevYear, thisQuarter, thisYear } from './shortcuts';

test('prevMonth', () => {
	expect(prevMonth(new Date(2023, 0, 1))).toEqual([new Date(2022, 11, 1), new Date(2023, 0, 0)]);
	expect(prevMonth(new Date(2023, 3, 1))).toEqual([new Date(2023, 2, 1), new Date(2023, 3, 0)]);
});

test('prevQuarter', () => {
	expect(prevQuarter(new Date(2023, 0, 1))).toEqual([new Date(2022, 9, 1), new Date(2023, 0, 0)]);
	expect(prevQuarter(new Date(2023, 3, 1))).toEqual([new Date(2023, 0, 1), new Date(2023, 3, 0)]);
});

test('thisQuarter', () => {
	expect(thisQuarter(new Date(2023, 0, 1))).toEqual([new Date(2023, 0, 1), new Date(2023, 3, 0)]);
	expect(thisQuarter(new Date(2023, 3, 1))).toEqual([new Date(2023, 3, 1), new Date(2023, 6, 0)]);
});

test('nextQuarter', () => {
	expect(nextQuarter(new Date(2023, 0, 1))).toEqual([new Date(2023, 3, 1), new Date(2023, 6, 0)]);
	expect(nextQuarter(new Date(2023, 3, 1))).toEqual([new Date(2023, 6, 1), new Date(2023, 9, 0)]);
});

test('prevYear', () => {
	expect(prevYear(new Date(2023, 0, 1))).toEqual([new Date(2022, 0, 1), new Date(2023, 0, 0)]);
	expect(prevYear(new Date(2023, 3, 1))).toEqual([new Date(2022, 0, 1), new Date(2023, 0, 0)]);
});

test('thisYear', () => {
	expect(thisYear(new Date(2023, 0, 1))).toEqual([new Date(2023, 0, 1), new Date(2024, 0, 0)]);
	expect(thisYear(new Date(2023, 3, 1))).toEqual([new Date(2023, 0, 1), new Date(2024, 0, 0)]);
});

test('nextYear', () => {
	expect(nextYear(new Date(2023, 0, 1))).toEqual([new Date(2024, 0, 1), new Date(2025, 0, 0)]);
	expect(nextYear(new Date(2023, 3, 1))).toEqual([new Date(2024, 0, 1), new Date(2025, 0, 0)]);
});
