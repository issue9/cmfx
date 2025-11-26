// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';
import * as z from 'zod';

import { zodValidator } from './validation';

const usr = z.object({
    name: z.string().min(2).max(100),
    age: z.number().min(18).max(100),
});

type User = z.infer<typeof usr>;

describe('zod', async()=>{
    const v = zodValidator(usr);

    test('valid', async () => {
        const user: User = {
            name: 'John Doe',
            age: 25,
        };

        const result = await v(user);
        expect(result[0]).toEqual(user);
        expect(result[1]).toBeUndefined();
    });


    test('invalid', async () => {
        const user: User = {
            name: 'John Doe',
            age: 12,
        };

        const result = await v(user);
        expect(result[0]).toBeUndefined();
        expect(result[1]![0].name).toEqual('age');
    });
});
