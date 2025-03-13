// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { HashRouter } from '@solidjs/router';
import { render } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { createSignal, ParentProps } from 'solid-js';
import { describe, expect, test } from 'vitest';

import { AppOptions } from '@/components';
import { buildContext } from '@/components/context/context';
import { options } from '@/components/context/options/options.spec';
import { API, Config, Locale, sleep } from '@/core';
import { buildItemsWithSearch, Search } from './search';

describe('search', async () => {
    const api = await API.build(localStorage, options.api.base, options.api.login, options.mimetype, 'zh-Hans');
    Locale.init('en', api);
    const l = new Locale(new Config('admin', sessionStorage));
    const menus: AppOptions['menus'] = [
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
        expect(buildItemsWithSearch(l, menus, '')).toHaveLength(0);
        expect(buildItemsWithSearch(l, menus, 'not-exists')).toHaveLength(0);

        expect(buildItemsWithSearch(l, menus, 'item-3')).toHaveLength(1);
        expect(buildItemsWithSearch(l, menus, 'item-2')).toHaveLength(2);
        expect(buildItemsWithSearch(l, menus, 'item-2-2')).toHaveLength(1);
        expect(buildItemsWithSearch(l, menus, 'group-1')).toHaveLength(2);
        expect(buildItemsWithSearch(l, menus, 'Group')).toHaveLength(2); // 忽略大小写
    });

    test('Search', async () => {
        window.HTMLLIElement.prototype.scrollIntoView = function() {};
        const user = userEvent.setup();

        const [_, setSwitch] = createSignal('');
        const { container, unmount } = render(() => <Search switch={setSwitch} />, {
            wrapper: (props: ParentProps) => {
                const Root = () => {
                    const opt = { ...options };
                    opt.menus = menus; // 替换菜单项
                    const { Provider } = buildContext(opt, api);
                    return <Provider>{props.children}</Provider>;
                };

                return <HashRouter root={Root}>{[]}</HashRouter>;
            },
        });

        const c = container.children.item(0);
        expect(c).toHaveClass('app-search');

        // 默认为空
        let ul = container.querySelector('.list');
        expect(ul!.children.length).toEqual(0);

        // 搜索不存在的内容
        let input = container.querySelector('input');
        await user.type(input!, 'not-exists');
        ul = container.querySelector('.list');
        expect(ul!.children.length).toEqual(0);

        // 搜索存在的内容
        input.value = ''; // 重置内容为空
        await user.type(input!, 'item');
        ul = container.querySelector('.list');
        expect(ul!.children.length).toBeGreaterThan(0);

        unmount();
    });
});
