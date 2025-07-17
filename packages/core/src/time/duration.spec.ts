// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { hour, ms, parseDuration, second, toIntlDuration, us } from './duration';

test('parseDuration', () => {
    expect(parseDuration(99)).toEqual(99);
    expect(parseDuration(99.9)).toEqual(100);
    expect(parseDuration(99.1)).toEqual(99);
    expect(parseDuration(9999)).toEqual(9999);
    expect(parseDuration(2000)).toEqual(2000);
    expect(parseDuration(9999999)).toEqual(9999999);
    expect(parseDuration()).toEqual(0);

    expect(parseDuration('1h')).toEqual(1 * hour);
    expect(parseDuration('1h2s')).toEqual(1 * hour + 2 * second);
    expect(parseDuration('1h2us')).toEqual(1 * hour + 2 * us);
    expect(parseDuration('3.9ms')).toEqual(3 * ms + 900 * us);
    expect(parseDuration('.9ms')).toEqual(900 * us);
    expect(parseDuration('16.089ms')).toEqual(16 * ms + 89 * us);
    expect(parseDuration('3.9ms10')).toEqual(3 * ms + 900 * us + 10);
    expect(parseDuration('3.9ms10us')).toEqual(3 * ms + 910 * us);
    expect(parseDuration('3.9ms800us')).toEqual(4 * ms + 700 * us);
    expect(parseDuration('1h2us555')).toEqual(1 * hour + 2 * us + 555);
    expect(parseDuration('5.426ms')).toEqual(5 * ms + 426 * us);
    expect(parseDuration(NaN)).toEqual(0);
    expect(() => parseDuration('1hour2us555')).toThrow('无法解析的单位名称 hour');
    expect(() => parseDuration('1h2us555nano')).toThrow('无法解析的单位名称 nano');
});

test('toIntlDuration', () => {
    expect(toIntlDuration(parseDuration(99))).toEqual({ nanoseconds: 99 });
    expect(toIntlDuration(parseDuration(99.9))).toEqual({ nanoseconds: 100 });
    expect(toIntlDuration(parseDuration(99.1))).toEqual({ nanoseconds: 99 });
    expect(toIntlDuration(parseDuration(9999))).toEqual({ nanoseconds: 999, microseconds: 9 });
    expect(toIntlDuration(parseDuration(2000))).toEqual({ microseconds: 2 });
    expect(toIntlDuration(parseDuration(9999999))).toEqual({ nanoseconds: 999, microseconds: 999, milliseconds: 9 });
    expect(toIntlDuration(parseDuration())).toEqual({ nanoseconds: 0 });

    expect(toIntlDuration(parseDuration('1h'))).toEqual({ hours: 1 });
    expect(toIntlDuration(parseDuration('1h2s'))).toEqual({ hours: 1, seconds: 2 });
    expect(toIntlDuration(parseDuration('1h2us'))).toEqual({ hours: 1, microseconds: 2 });
    expect(toIntlDuration(parseDuration('3.9ms'))).toEqual({ milliseconds: 3, microseconds: 900 });
    expect(toIntlDuration(parseDuration('.9ms'))).toEqual({ microseconds: 900 });
    expect(toIntlDuration(parseDuration('16.089ms'))).toEqual({ milliseconds: 16, microseconds: 89 });
    expect(toIntlDuration(parseDuration('3.9ms10'))).toEqual({ milliseconds: 3, microseconds: 900, nanoseconds: 10 });
    expect(toIntlDuration(parseDuration('3.9ms10us'))).toEqual({ milliseconds: 3, microseconds: 910 });
    expect(toIntlDuration(parseDuration('3.9ms800us'))).toEqual({ milliseconds: 4, microseconds: 700 });
    expect(toIntlDuration(parseDuration('1h2us555'))).toEqual({ hours: 1, microseconds: 2, nanoseconds: 555 });
    expect(toIntlDuration(parseDuration('999999999'))).toEqual({ milliseconds: 999, microseconds: 999, nanoseconds: 999 });
    expect(toIntlDuration(parseDuration('5.426ms'))).toEqual({ milliseconds: 5, microseconds: 426 });
    expect(toIntlDuration(parseDuration(NaN))).toEqual({ nanoseconds: 0 });
    expect(() => toIntlDuration(parseDuration('1hour2us555'))).toThrow('无法解析的单位名称 hour');
    expect(() => toIntlDuration(parseDuration('1h2us555nano'))).toThrow('无法解析的单位名称 nano');
});
