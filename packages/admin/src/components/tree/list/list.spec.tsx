// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { render } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';

import { Item } from '@admin/components/tree/item';
import { List } from './list';

describe('List', async () => {
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
                            type: 'item', value: 'v234', label: 'v234', items: [
                                { type: 'item', value: 'v2341', label: 'v2341' },
                                { type: 'divider' },
                                { type: 'item', value: 'v2342', label: 'v2342' },
                                { type: 'item', value: 'v2343', label: 'v2343' },
                            ]
                        },
                    ]
                },
            ]
        },
    ];

    const user = userEvent.setup();

    test('preset', async () => {
        const { container, unmount } = render(() => <List>{[...items]}</List>);
        const c = container.children.item(0)!;
        expect(c).toHaveClass('c--list');

        unmount();
    });

    test('onchange', async () => {
        let val, old;
        const { unmount, getByText } = render(() => <List onChange={(v, o) => { val = v; old = o; }}>{[...items]}</List>);

        const v1 = getByText('v1');
        await user.click(v1);
        expect(val).toEqual('v1');

        const v2 = getByText('v2343');
        await user.click(v2);
        expect(val).toEqual('v2343');
        expect(old).toEqual('v1');

        unmount();
    });
});