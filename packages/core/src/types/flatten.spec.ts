// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { assertType, expect, test } from 'vitest';

import { Flatten, flatten, Keys } from './flatten';

test('flatten', () => {
    const o1 = { x: '1' };
    expect(flatten(o1)).toEqual({ 'x': '1' });

    const o2 = { x: '1', y: { z: '2' } };
    expect(flatten(o2)).toEqual({ 'x': '1', 'y.z': '2' });

    const o3 = {
        x: '1',
        y: { z: '2' },
        yy: {
            z: '3', zz: { z: 4 }
        },
        zz: '4',
        zzz: '5'
    };
    expect(flatten(o3)).toEqual({ 'x': '1', 'y.z': '2', 'yy.z': '3', 'yy.zz.z': 4, 'zz': '4', zzz: '5' });

    const o4 = { x: 1, y: { z: '2' } };
    expect(flatten(o4)).toEqual({ 'x': 1, 'y.z': '2' });
});

type Sample = {
    a?: string;
    b: { c: number; d: { e: boolean } };
};

type ExpectedKeys = 'a' | 'b.c' | 'b.d.e';
type ActualKeys = Keys<Sample>;

type Key1 = ActualKeys extends ExpectedKeys ? true : false; // 应为 true
type Key2 = ExpectedKeys extends ActualKeys ? true : false; // 应为 true
assertType<Key1>(true);
assertType<Key2>(true);

type ExpectedTypes = { a: string, 'b.c': number, 'b.d.e': boolean };
type ActualTypes = Flatten<Sample>;

type Type1 = ActualTypes extends ExpectedTypes ? true : false; // 应为 true
type Type2 = ExpectedTypes extends ActualTypes ? true : false; // 应为 true
assertType<Type1>(true);
assertType<Type2>(true);
