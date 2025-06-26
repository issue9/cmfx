// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { ExpandType, FlattenKeys } from '@cmfx/core';
import { describe, expect, test } from 'vitest';

import { ObjectAccessor } from './access';
import { Accessor } from './field';

describe('ObjectAccessor', () => {
    interface Object {
        [k: string]: unknown;
        f1: number;
        f2: string;
    }

    const f = new ObjectAccessor<ExpandType<Object>>({ 'f1': 5, 'f2': 'f2' });
    expect(f.isPreset()).toEqual<boolean>(true);
    t(f.accessor('f1'));
    expect(f.object()).toEqual({ 'f1': 7, 'f2': 'f2' });
    expect(f.isPreset()).toEqual<boolean>(false);

    test('validation', () => {
        const v = (_: Object) => { return new Map<FlattenKeys<ExpandType<Object>>, string>([['f1', 'err']]); };
        expect(f.object(v)).toBeUndefined();
        expect(f.accessor('f1').getError(), 'err');

        const f1 = f.accessor('f1');
        expect(f1).toEqual(f.accessor('f1'));

        f.reset();
        expect(f.isPreset()).toBeTruthy();
        expect(f1).toEqual(f.accessor('f1')); // 同一个 Accessor 接口只有一个对象
    });


    test('setPreset', () => {
        f.setPreset({ 'f1': 1, 'f2': '2' });
        expect(f.isPreset()).toBeFalsy();
        f.reset();
        expect(f.isPreset()).toBeTruthy();
        expect(f.accessor('f1').getValue()).toEqual(1);
    });

    test('setObject', () => {
        f.setObject({ 'f1': 11, 'f2': '22' });
        expect(f.accessor('f1').getValue()).toEqual(11);
        expect(f.accessor('f2').getValue()).toEqual('22');
    });
    
    test('children', () => {
        const a = f.accessor<number>('not.exists' as any);
        expect(a.getValue()).toBeUndefined();
        
        a.setValue(5);
        expect(a.getValue()).toEqual(5);
    });
});

function t(a: Accessor<number>) {
    expect(a.getError()).toBeUndefined();
    expect(a.getValue()).toEqual<number>(5);

    a.setError('error');
    expect(a.getError()).toEqual<string>('error');

    a.setValue(7);
    expect(a.getValue()).toEqual<number>(7);
    expect(a.getError()).toEqual<string>('error');
    a.setError('error');

    a.reset();
    expect(a.getValue()).toEqual<number>(5);
    expect(a.getError()).toBeUndefined();

    a.setValue(7);
}
