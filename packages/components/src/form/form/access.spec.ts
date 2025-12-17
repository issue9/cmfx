// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { ExpandType, sleep, ValidResult } from '@cmfx/core';
import { describe, expect, test } from 'vitest';

import { ObjectAccessor } from './access';

type Object = {
    age: number;
    name: string;
};

describe('validation', async () => {
    test('obj', async () => {
        const validator = async (v: Object): Promise<ValidResult<Object>> => {
            if (v.age < 18) {
                return [undefined, [{ name: 'age', reason: 'age must be greater than or equal to 18' }]];
            }
            return [v, undefined];
        };

        const oa = new ObjectAccessor<ExpandType<Object>>({ 'age': 20, 'name': 'f2' }, validator, true);

        const age = oa.accessor('age');
        age.setValue(2);
        await sleep(500); // setValue 触发的 onchange 是异步操作
        const obj = await oa.object();
        expect(obj).toBeUndefined();
        expect(age.getError()).toEqual('age must be greater than or equal to 18'); // 触发验证
    });

    test('field', async () => {
        const validator = async (v: any, name?: string): Promise<ValidResult<Object>> => {
            if (v < 18 && name === 'age') {
                return [undefined, [{ name: 'age', reason: 'age must be greater than or equal to 18' }]];
            }
            return [{ [name!]: v } as any, undefined];
        };

        const oa = new ObjectAccessor<ExpandType<Object>>({ 'age': 20, 'name': 'f2' }, validator, true);

        const age = oa.accessor('age');
        age.setValue(2);
        await sleep(500); // setValue 触发的 onchange 是异步操作
        expect(age.getValue()).toEqual<number>(2);
        expect(age.getError()).toEqual('age must be greater than or equal to 18'); // 触发验证
    });
});

describe('ObjectAccessor', async () => {
    const validator = async (v: Object): Promise<ValidResult<Object>> => {
        if (v.age < 18) {
            return [undefined, [{ name: 'age', reason: 'age must be greater than or equal to 18' }]];
        }
        return [v, undefined];
    };

    const oa = new ObjectAccessor<ExpandType<Object>>({ 'age': 20, 'name': 'f2' }, validator, true);

    test('基本属性', async () => {
        expect(oa.isPreset()).toEqual<boolean>(true);
        expect(await oa.object()).toEqual({ 'age': 20, 'name': 'f2' });
        expect(oa.getValue()).toEqual({ 'age': 20, 'name': 'f2' });
    });

    test('field access', async () => {
        const age = oa.accessor('age');
        expect(age).toEqual(oa.accessor('age')); // 同一个 Accessor 接口只有一个对象

        expect(age.getError()).toBeUndefined();
        expect(age.getValue()).toEqual<number>(20);

        age.setError('error');
        expect(age.getError()).toEqual<string>('error');

        age.setValue(25);
        expect(age.getValue()).toEqual<number>(25);
        await sleep(500); // setValue 触发的 onchange 是异步操作
        expect(age.getError()).toBeUndefined(); // 触发验证，错误信息被清除

        age.reset();
        expect(age.getValue()).toEqual<number>(20);
        expect(age.getError()).toBeUndefined();
    });

    test('setPreset', () => {
        oa.setPreset({ 'age': 20, 'name': '2' });
        expect(oa.isPreset()).toBeFalsy();
        oa.reset();
        expect(oa.isPreset()).toBeTruthy();
        expect(oa.accessor('age').getValue()).toEqual(20);

        oa.accessor('age').setValue(22);
        expect(oa.isPreset()).toBeFalsy();
    });

    test('setValue', () => {
        oa.setValue({ 'age': 21, 'name': '22' });
        expect(oa.accessor('age').getValue()).toEqual(21);
        expect(oa.accessor('name').getValue()).toEqual('22');
    });

    test('children', () => {
        const a = oa.accessor<number>('not.exists' as any);
        expect(a.getValue()).toEqual('');

        a.setValue(25);
        expect(a.getValue()).toEqual(25);
    });
});
