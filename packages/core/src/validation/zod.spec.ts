// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';
import * as z from 'zod';

import { Locale } from '@/locale';
import { createZodLocaleLoader, validator } from './zod';

const usr = z.object({
    name: z.string().min(2).max(100),
    age: z.number().min(18).max(100),
    address: z.array(z.string().min(2).max(100)).length(2),
});

type User = z.infer<typeof usr>;

describe('zod', async () => {
    const enLoader = createZodLocaleLoader((await import('../../node_modules/zod/v4/locales/en.js')).default);
    const zhLoader = createZodLocaleLoader((await import('../../node_modules/zod/v4/locales/zh-CN.js')).default);
    await enLoader('en');
    await zhLoader('zh-CN');

    Locale.init('en');
    Locale.addDict('zh', async () => { return undefined; });
    Locale.addDict('en', async () => { return undefined; });

    test('valid', async () => {
        const user: User = {
            name: 'John Doe',
            age: 25,
            address: ['123 Main St', '456 Elm St']
        };

        const result = await validator(usr)(user);
        expect(result[0]).toEqual(user);
        expect(result[1]).toBeUndefined();
    });


    test('invalid', async () => {
        const user: User = {
            name: 'John Doe',
            age: 12,
            address: ['123 Main St', '']
        };

        const result = await validator(usr)(user);
        expect(result[0]).toBeUndefined();
        expect(result[1]![0].name).toEqual('age');
        expect(result[1]![0].reason).toEqual('Too small: expected number to be >=18');
        expect(result[1]![1].name).toEqual('address[1]');
    });

    test('invalid-en', async () => {
        const user: User = {
            name: 'John Doe',
            age: 12,
            address: ['123 Main St', '']
        };

        const result = await validator(usr, 'en-us')(user);
        expect(result[0]).toBeUndefined();
        expect(result[1]![0].name).toEqual('age');
        expect(result[1]![0].reason).toEqual('Too small: expected number to be >=18');
        expect(result[1]![1].name).toEqual('address[1]');
    });

    test('invalid-zh', async () => {
        const user: User = {
            name: 'John Doe',
            age: 12,
            address: ['123 Main St', '']
        };

        const result = await validator(usr, 'zh')(user);
        expect(result[0]).toBeUndefined();
        expect(result[1]![0].name).toEqual('age');
        expect(result[1]![0].reason).toEqual('数值过小：期望 number >=18');
        expect(result[1]![1].name).toEqual('address[1]');
    });

    test('with path', async () => {
        const user: User = {
            name: 'John Doe',
            age: 12,
            address: ['123 Main St', '']
        };

        let result = await validator<User>(usr, 'zh')(user.name, 'name');
        expect(result[0]).toEqual('John Doe');
        expect(result[1]).toBeUndefined();

        result = await validator<User>(usr, 'zh')(user.age, 'age');
        expect(result[0]).toBeUndefined();
        expect(result[1]![0].name).toEqual('age');
    });
});
