// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { assertType, expect, test } from 'vitest';

import { Flatten, flatten, Keys } from './flatten';
import { Expand } from './types';

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

// type xx = {}

type Type = {
    a?: string;
    b: { c: number; d: { e: boolean } };
};

type TExpectedKeys = 'a' | 'b.c' | 'b.d.e';
type TActualKeys = Keys<Type>;

type TKey1 = TActualKeys extends TExpectedKeys ? true : false; // 应为 true
type TKey2 = TExpectedKeys extends TActualKeys ? true : false; // 应为 true
assertType<TKey1>(true);
assertType<TKey2>(true);

type TExpectedTypes = { a: string, 'b.c': number, 'b.d.e': boolean };
type TActualTypes = Flatten<Type>;

type Type1 = TActualTypes extends TExpectedTypes ? true : false; // 应为 true
type Type2 = TExpectedTypes extends TActualTypes ? true : false; // 应为 true
assertType<Type1>(true);
assertType<Type2>(true);

// interface xx {[k:string]:unknown,...}

interface Interface {
    [k: string]: unknown;
    a?: string;
    b: { c: number; d: { e: boolean } };
}

type IExpectedKeys = 'a' | 'b.c' | 'b.d.e';
type IActualKeys = Keys<Interface>;

type IKey1 = IActualKeys extends IExpectedKeys ? true : false; // 应为 true
type IKey2 = IExpectedKeys extends IActualKeys ? true : false; // 应为 true
assertType<IKey1>(true);
assertType<IKey2>(true);

type IExpectedTypes = { a: string, 'b.c': number, 'b.d.e': boolean };
type IActualTypes = Flatten<Interface>;

type IType1 = IActualTypes extends IExpectedTypes ? true : false; // 应为 true
type IType2 = IExpectedTypes extends IActualTypes ? true : false; // 应为 true
assertType<IType1>(true);
assertType<IType2>(true);

// interface xx {,...}

interface Interface2 {
    a?: string;
    b: { c: number; d: { e: boolean } };
}

type I2ExpectedKeys = 'a' | 'b.c' | 'b.d.e';
type I2ActualKeys = Keys<Expand<Interface2>>;

type I2Key1 = I2ActualKeys extends I2ExpectedKeys ? true : false; // 应为 true
type I2Key2 = I2ExpectedKeys extends I2ActualKeys ? true : false; // 应为 true
assertType<I2Key1>(true);
assertType<I2Key2>(true);

type I2ExpectedTypes = { a: string, 'b.c': number, 'b.d.e': boolean };
type I2ActualTypes = Flatten<Expand<Interface2>>;

type I2Type1 = I2ActualTypes extends I2ExpectedTypes ? true : false; // 应为 true
type I2Type2 = I2ExpectedTypes extends I2ActualTypes ? true : false; // 应为 true
assertType<I2Type1>(true);
assertType<I2Type2>(true);

// interface xx {b:yy}, interface yy{...}

interface Interface3 {
    a?: string;
    b: InterfaceB;
}
interface InterfaceB {
    c: number; d: { e: boolean }
}

type I3ExpectedKeys = 'a' | 'b.c' | 'b.d.e';
type I3ActualKeys = Keys<Expand<Interface3>>;

type I3Key1 = I3ActualKeys extends I3ExpectedKeys ? true : false; // 应为 true
type I3Key2 = I3ExpectedKeys extends I3ActualKeys ? true : false; // 应为 true
assertType<I3Key1>(true);
assertType<I3Key2>(true);


// interface xx {...}, interface yy extends xx{...}

interface Interface4_1 {
    a?: string;
}
interface Interface4 extends Interface4_1 {
    c: number; d: { e: boolean }
}

type I4ExpectedKeys = 'a' | 'c' | 'd.e';
type I4ActualKeys = Keys<Expand<Interface4>>;

type I4Key1 = I4ActualKeys extends I4ExpectedKeys ? true : false; // 应为 true
type I4Key2 = I4ExpectedKeys extends I4ActualKeys ? true : false; // 应为 true
assertType<I4Key1>(true);
assertType<I4Key2>(true);