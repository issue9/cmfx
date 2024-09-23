// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { parseDuration } from './duration';

test('parseDuration', () => {
    expect(parseDuration(99)).toEqual({ nanoseconds: 99 });
    expect(parseDuration(9999)).toEqual({ nanoseconds: 999, microseconds: 9 });
    expect(parseDuration(9999999)).toEqual({ nanoseconds: 999, microseconds: 999, milliseconds: 9 });
    expect(parseDuration()).toEqual({ nanoseconds: 0 });

    expect(parseDuration('1h')).toEqual({ hours: 1 });
    expect(parseDuration('1h2s')).toEqual({ hours: 1, seconds: 2 });
    expect(parseDuration('1h2us')).toEqual({ hours: 1, microseconds: 2 });
    expect(parseDuration('1h2us555')).toEqual({ hours: 1, microseconds: 2, nanoseconds: 555 });
    expect(parseDuration('999999999')).toEqual({ milliseconds: 999, microseconds: 999, nanoseconds: 999 });
    expect(()=>parseDuration('1hour2us555')).toThrow('无法解析的单位名称 hour');
    expect(()=>parseDuration('1h2us555nano')).toThrow('无法解析的单位名称 nano');
});
