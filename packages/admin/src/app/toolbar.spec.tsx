// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { sleep } from '@cmfx/core';
import { HashRouter } from '@solidjs/router';
import { render } from '@solidjs/testing-library';
import { createSignal, ParentProps } from 'solid-js';
import { expect, test } from 'vitest';

import { Provider } from '@/context/context';
import { options } from '@/context/options/options.spec';
import Toolbar from './toolbar';

test('toolbar', async () => {
    const menus = createSignal(false);
    const [_, setSwitch] = createSignal('');

    const { container, unmount } = render(() => <Toolbar switch={setSwitch} menuVisible={menus} />, {
        wrapper: (props: ParentProps) => {
            return <HashRouter root={() => <Provider {...options}>{ props.children }</Provider>}>{[]}</HashRouter>;
        },
    });

    await sleep(500); // Provider 需要等待其 API 初始化完成。
    expect(container.querySelector('.app-bar')).toBeTruthy();

    unmount();
});
