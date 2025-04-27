// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { API, Config, Locale } from '@cmfx/core';
import { HashRouter } from '@solidjs/router';
import { render } from '@solidjs/testing-library';
import { createSignal, ParentProps } from 'solid-js';
import { expect, test } from 'vitest';

import { buildContext } from '@/context/context';
import { options } from '@/context/options/options.spec';
import Toolbar from './toolbar';

test('toolbar', async () => {
    const ao = options.api;
    const conf = new Config(options.id, '');
    const api = await API.build(conf, ao.base, ao.token, ao.contentType, ao.acceptType, 'zh-Hans');
    Locale.init(conf, 'en', api);
    const menus = createSignal(false);
    const [_, setSwitch] = createSignal('');
    const { Provider } = await buildContext(options);

    const { container, unmount } = render(() => <Toolbar switch={setSwitch} menuVisible={menus} />, {
        wrapper: (props: ParentProps) => {
            const Root = () => {
                return <Provider>{props.children}</Provider>;
            };

            return <HashRouter root={Root}>{[]}</HashRouter>;
        },
    });

    const c = container.children.item(0);
    expect(c).toHaveClass('app-bar');

    unmount();
});
