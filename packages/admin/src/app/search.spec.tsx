// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Dict, Locale, sleep } from '@cmfx/core';
import { HashRouter } from '@solidjs/router';
import { render } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { createSignal, ParentProps } from 'solid-js';
import { describe, expect, test } from 'vitest';

import { Provider } from '@/context/context';
import { MenuItem } from '@/options';
import { options } from '@/options/options.spec';
import { buildItemsWithSearch, Search } from './search';
import styles from './style.module.css';

describe('search', async () => {
    Locale.init('en');
    await Locale.addDict('en', async (): Promise<Dict> => { return {}; });
    const l = new Locale('en', 'full');
    const t = (key: string)=>l.t(key);
    const menus: Array<MenuItem> = [
        {'type': 'divider'},
        {'type': 'item', label: 'item-1'},
        {'type': 'item', label: 'item-2', items: [
            {'type': 'item', label: 'item-2-1'},
            {'type': 'item', label: 'item-2-2'},
        ]},
        {'type': 'item', label: 'item-3'},
        {'type': 'group', label: 'group-1', items: [
            {'type': 'item', label: 'group-1-1'},
            {'type': 'item', label: 'group-1-2'},
        ]},
    ];

    test('buildItemsWithSearch', async () => {
        expect(buildItemsWithSearch(t, menus, '')).toHaveLength(0);
        expect(buildItemsWithSearch(t, menus, 'not-exists')).toHaveLength(0);

        expect(buildItemsWithSearch(t, menus, 'item-3')).toHaveLength(1);
        expect(buildItemsWithSearch(t, menus, 'item-2')).toHaveLength(2);
        expect(buildItemsWithSearch(t, menus, 'item-2-2')).toHaveLength(1);
        expect(buildItemsWithSearch(t, menus, 'group-1')).toHaveLength(2);
        expect(buildItemsWithSearch(t, menus, 'Group')).toHaveLength(2); // 忽略大小写
    });

    test('Search', async () => {
        window.HTMLLIElement.prototype.scrollIntoView = function() {};
        const user = userEvent.setup();

        const [_, setSwitch] = createSignal('');
        const { container, unmount } = render(() => <Search switch={setSwitch} />, {
            wrapper: (props: ParentProps) => {
                const opt = { ...options }; // NOTE: structedClone 是无法复制 Storage 类型的。
                opt.aside.menus = menus; // 替换菜单项
                return <HashRouter root={() => (
                    <Provider {...opt}>{props.children}</Provider>
                )}>{[]}</HashRouter>;
            },
        });

        await sleep(500); // Provider 需要等待其 API 初始化完成。
        expect(container.querySelector('.'+styles.search)).toBeTruthy();

        // 默认为空
        let ul = container.querySelector('.'+styles.list);
        expect(ul!.children.length).toEqual(0);

        // 搜索不存在的内容
        let input = container.querySelector('input');
        await user.type(input!, 'not-exists');
        ul = container.querySelector('.'+styles.list);
        expect(ul!.children.length).toEqual(0);

        // 搜索存在的内容
        input!.value = ''; // 重置内容为空
        await user.type(input!, 'item');
        ul = container.querySelector('.'+styles.llist);
        expect(ul!.children.length).toBeGreaterThan(0);

        unmount();
    });
});
