// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { HashRouter } from '@solidjs/router';
import { render } from '@solidjs/testing-library';
import { createSignal, ParentProps } from 'solid-js';
import { expect, test } from 'vitest';

import { buildContext } from '@/components/context/context';
import { options } from '@/components/context/options/options.spec';
import { API, Locale } from '@/core';
import Toolbar from './toolbar';

test('toolbar', async () => {
    const ao = options.api;
    const api = await API.build(options.id, ao.base, ao.token, ao.contentType, ao.acceptType, 'zh-Hans', localStorage);
    Locale.init('en', api);
    const menus = createSignal(false);
    const [_, setSwitch] = createSignal('');

    const { container, unmount } = render(() => <Toolbar switch={setSwitch} menuVisible={menus} />, {
        wrapper: (props: ParentProps) => {
            const Root = () => {
                const { Provider } = buildContext(options, api);
                return <Provider>{props.children}</Provider>;
            };

            return <HashRouter root={Root}>{[]}</HashRouter>;
        },
    });

    const c = container.children.item(0);
    expect(c).toHaveClass('app-bar');

    unmount();
});
