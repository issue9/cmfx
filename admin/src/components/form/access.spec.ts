// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';
import { Accessor, FieldAccessor, ObjectAccessor } from './access';

test('field access', () => {
    const f = FieldAccessor('name', 5);
    t(f);
});

test('object access', () => {
    interface Object {
        f1: number;
        f2: string;
    }

    const f = new ObjectAccessor<Object>({ 'f1': 5, 'f2': 'f2' });
    expect(f.isPreset()).toEqual<boolean>(true);
    t(f.accessor('f1'));
    expect(f.object()).toEqual({ 'f1': 7, 'f2': 'f2' });
    expect(f.isPreset()).toEqual<boolean>(false);

    // 验证
    const v = (_: Object) => { return new Map<keyof Object, string>([['f1', 'err']]); };
    expect(f.object(v)).toBeUndefined();
    expect(f.accessor('f1').getError(), 'err');

    f.reset();
    expect(f.isPreset()).toEqual<boolean>(true);
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
