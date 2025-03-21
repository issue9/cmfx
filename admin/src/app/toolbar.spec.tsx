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
    const api = await API.build(localStorage, options.api.base, options.api.login, options.mimetype, 'zh-Hans');
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
