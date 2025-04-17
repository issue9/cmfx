// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { render } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';

import { Item } from '@components/tree/item';
import { Menu } from './menu';

describe('Menu', async () => {
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
        const { container, unmount } = render(() => <Menu activator={<button>click</button>}>{[...items]}</Menu>);
        const c = container.children.item(0)!.lastChild;
        expect(c).toHaveClass('c--menu');

        unmount();
    });

    test('onchange', async () => {
        let val;
        const change = (v?: string): boolean | undefined => {
            val = v;
            return undefined;
        };
        const { unmount, getByText } = render(() => <Menu activator={<button>click</button>} onChange={change}>{[...items]}</Menu>);

        const btn = getByText('click');
        await user.click(btn);
        const v1 = getByText('v1');
        await user.click(v1);
        expect(val).toEqual('v1');

        unmount();
    });
});
