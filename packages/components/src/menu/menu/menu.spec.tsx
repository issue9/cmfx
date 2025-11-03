// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { sleep } from '@cmfx/core';
import { render } from '@solidjs/testing-library';
import { describe, expect, test } from 'vitest';

import { Provider } from '@/context/context.spec';
import { default as Menu, Ref, selectedElements } from './menu';
import { MenuItem } from './item';

const items: Array<MenuItem<string>> = [
    { type: 'item', value: 'v1', label: 'v1-label' },
    { type: 'item', value: 'v2', label: 'v2-label', disabled: true },
    { type: 'item', value: 'v3', label: 'v3-label' },
    { type: 'divider' },
    {
        type: 'group', label: 'group-label', items: [
            { type: 'item', value: 'v22', label: 'v22-label' },
            { type: 'divider' },
            {
                type: 'item', value: 'v23', label: 'v23-label', items: [
                    { type: 'item', value: 'v233', label: 'v233-label' },
                    {
                        type: 'item', label: 'v234-label', items: [
                            { type: 'item', value: 'v2341', label: 'v2341-label' },
                            { type: 'item', value: 'v2343', label: 'v2343-label' },
                        ]
                    },
                ]
            },
        ]
    },
];

describe('Menu', () => {
    test('ref', async () => {
        let ref: Ref;
        const { unmount } = render(() => <Menu multiple items={items} value={['v1', 'v233']} ref={el => ref = el} />, {
            wrapper: Provider,
        });

        await sleep(500); // Provider 是异步的，需要等待其完成加载。

        expect(ref!.element()).not.toBeUndefined();

        unmount();
    });
});

describe('selectedElements', async () => {
    const els = <ul id="root">
        <li aria-selected="true">v1-label</li>
        <li>v2-label
            <ul>
                <li>v23-label
                    <ul>
                        <li aria-selected="true">v231-label</li>
                        <li>v232-label</li>
                    </ul>
                </li>
                <li>v24-label</li>
            </ul>
        </li>
    </ul>;

    // 需要加载到 DOM，否则测试失败！
    const { unmount } = render(() => els, {
        wrapper: Provider,
    });

    await sleep(500); // Provider 是异步的，需要等待其完成加载。

    test('!root', () => {
        const el = selectedElements(els as any);
        expect(el).toHaveLength(2);
        expect(el[0]).toHaveTextContent('v1-label');
        expect(el[1]).toHaveTextContent('v231-label');
    });

    test('root', () => {
        const el = selectedElements(els as any, true);
        expect(el).toHaveLength(2);
        expect(el[0]).toHaveTextContent('v1-label');
        // 包含了所有子节点的文本，根节点在最前，group 类型不参与计算。
        expect(el[1].textContent?.trim().startsWith('v2-label')).toBe(true);
    });

    unmount();
});
