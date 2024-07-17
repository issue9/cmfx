// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { monthDays, range, weekDay } from './utils';

test('add weekDay', () => {
    expect(weekDay(0, 0)).toEqual(0);
    expect(weekDay(0, 2)).toEqual(2);
    expect(weekDay(0, 4)).toEqual(4);
    expect(weekDay(0, 6)).toEqual(6);

    expect(weekDay(1, 0)).toEqual(1);
    expect(weekDay(1, 2)).toEqual(3);
    expect(weekDay(1, 4)).toEqual(5);
    expect(weekDay(1, 6)).toEqual(0);

    expect(weekDay(5, 0)).toEqual(5);
    expect(weekDay(5, 2)).toEqual(0);
    expect(weekDay(5, 4)).toEqual(2);
    expect(weekDay(5, 6)).toEqual(4);
});

test('sub weekDay', () => {
    expect(weekDay(0, 0)).toEqual(0);
    expect(weekDay(0, -2)).toEqual(5);
    expect(weekDay(0, -4)).toEqual(3);
    expect(weekDay(0, -6)).toEqual(1);

    expect(weekDay(1, 0)).toEqual(1);
    expect(weekDay(1, -2)).toEqual(6);
    expect(weekDay(1, -4)).toEqual(4);
    expect(weekDay(1, -6)).toEqual(2);

    expect(weekDay(5, 0)).toEqual(5);
    expect(weekDay(5, -2)).toEqual(3);
    expect(weekDay(5, -4)).toEqual(1);
    expect(weekDay(5, -6)).toEqual(6);
});

test('monthDays', () => {
    expect(monthDays(new Date(2024, 6, 1), 0)).toEqual([
        [false, 5, 30, 30],
        [true, 6, 1, 31],
        [false, 7, 1, 3]
    ]);

    expect(monthDays(new Date(2024, 6, 1), 1)).toEqual([
        [false, 0, 0, 0],
        [true, 6, 1, 31],
        [false, 7, 1, 4]
    ]);

    expect(monthDays(new Date(2024, 6, 1), 2)).toEqual([
        [false, 5, 25, 30],
        [true, 6, 1, 31],
        [false, 7, 1, 5]
    ]);

    expect(monthDays(new Date(2024, 6, 1), 3)).toEqual([
        [false, 5, 26, 30],
        [true, 6, 1, 31],
        [false, 7, 1, 6]
    ]);

    expect(monthDays(new Date(2024, 6, 1), 4)).toEqual([
        [false, 5, 27, 30],
        [true, 6, 1, 31],
        [false, 0, 0, 0]
    ]);

    expect(monthDays(new Date(2024, 6, 1), 5)).toEqual([
        [false, 5, 28, 30],
        [true, 6, 1, 31],
        [false, 7, 1, 1]
    ]);

    expect(monthDays(new Date(2024, 6, 1), 6)).toEqual([
        [false, 5, 29, 30],
        [true, 6, 1, 31],
        [false, 7, 1, 2]
    ]);
});

test('range', () => {
    expect(range(1, 2)).toEqual([1, 2]);
    expect(range(1, 1)).toEqual([1]);
    expect(range(0, 2)).toEqual([0, 1, 2]);
    expect(range(0, 0)).toEqual([]);
});
