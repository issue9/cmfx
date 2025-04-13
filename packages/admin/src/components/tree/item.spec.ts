// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { Item, findItems } from './item';

test('findItems', () => {
    const items: Array<Item> = [
        { type: 'item', value: 'v1', label: 'v1' },
        { type: 'item', value: 'v2', label: 'v2' },
        { type: 'item', value: 'v3', label: 'v3' },
        { type: 'divider' },
        {
            type: 'group', label: 'group', items: [
                { type: 'item', value: 'v22', label: 'v22' },
                { type: 'divider' },
                {
                    type: 'item', value: 'v23', label: 'v23', items: [
                        { type: 'item', value: 'v233', label: 'v233' },
                        {
                            type: 'item', label: 'v234', items: [
                                { type: 'item', value: 'v2341', label: 'v2341' },
                                { type: 'item', value: 'v2343', label: 'v2343' },
                            ]
                        },
                    ]
                },
            ]
        },
    ];

    expect(findItems(items, 'v2')).toEqual([1]);
    expect(findItems(items, 'v22')).toEqual([4,0]);
    expect(findItems(items, 'v2343')).toEqual([4,2,1,1]);
    expect(findItems(items, 'not-exists')).toBeUndefined();
    expect(findItems(items)).toBeUndefined();
});
