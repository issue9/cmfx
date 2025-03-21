// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { getWeekDays, monthDays, weekDay } from './utils';

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
        { isCurrent: false, month: 5, start: 30, end: 30, year: 2024 },
        { isCurrent: true, month: 6, start: 1, end: 31, year: 2024 },
        { isCurrent: false, month: 7, start: 1, end: 10, year: 2024 }
    ]);

    expect(monthDays(new Date(2024, 6, 1), 1)).toEqual([
        { isCurrent: false, month: 0, start: 0, end: 0, year: 0 },
        { isCurrent: true, month: 6, start: 1, end: 31, year: 2024 },
        { isCurrent: false, month: 7, start: 1, end: 11, year: 2024 }
    ]);

    expect(monthDays(new Date(2024, 6, 1), 2)).toEqual([
        { isCurrent: false, month: 5, start: 25, end: 30, year: 2024 },
        { isCurrent: true, month: 6, start: 1, end: 31, year: 2024 },
        { isCurrent: false, month: 7, start: 1, end: 5, year: 2024 }
    ]);

    expect(monthDays(new Date(2024, 6, 1), 3)).toEqual([
        { isCurrent: false, month: 5, start: 26, end: 30, year: 2024 },
        { isCurrent: true, month: 6, start: 1, end: 31, year: 2024 },
        { isCurrent: false, month: 7, start: 1, end: 6, year: 2024 }
    ]);

    expect(monthDays(new Date(2024, 6, 1), 4)).toEqual([
        { isCurrent: false, month: 5, start: 27, end: 30, year: 2024 },
        { isCurrent: true, month: 6, start: 1, end: 31, year: 2024 },
        { isCurrent: false, month: 7, start: 1, end: 7, year: 2024 }
    ]);

    expect(monthDays(new Date(2024, 6, 1), 5)).toEqual([
        { isCurrent: false, month: 5, start: 28, end: 30, year: 2024 },
        { isCurrent: true, month: 6, start: 1, end: 31, year: 2024 },
        { isCurrent: false, month: 7, start: 1, end: 8, year: 2024 }
    ]);

    expect(monthDays(new Date(2024, 6, 1), 6)).toEqual([
        { isCurrent: false, month: 5, start: 29, end: 30, year: 2024 },
        { isCurrent: true, month: 6, start: 1, end: 31, year: 2024 },
        { isCurrent: false, month: 7, start: 1, end: 9, year: 2024 }
    ]);
});

test('getWeekDays', () => {
    expect(getWeekDays([
        { isCurrent: false, month: 5, start: 29, end: 30, year: 2024 },
        { isCurrent: true, month: 6, start: 1, end: 17, year: 2024 },
        { isCurrent: false, month: 7, start: 1, end: 2, year: 2024 }])
    ).toEqual<Array<Array<[boolean, number, number]>>>([
        [[false, 5, 29], [false, 5, 30], [true, 6, 1], [true, 6, 2], [true, 6, 3], [true, 6, 4], [true, 6, 5]],
        [[true, 6, 6], [true, 6, 7], [true, 6, 8], [true, 6, 9], [true, 6, 10], [true, 6, 11], [true, 6, 12]],
        [[true, 6, 13], [true, 6, 14], [true, 6, 15], [true, 6, 16], [true, 6, 17], [false, 7, 1], [false, 7, 2]]
    ]);
});
