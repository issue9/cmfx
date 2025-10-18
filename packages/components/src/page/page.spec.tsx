// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { sleep } from '@cmfx/core';
import { render } from '@solidjs/testing-library';
import { describe, expect, test } from 'vitest';

import { Provider } from '@/context/context.spec';
import { Page, Ref } from './page';

describe('Page.ref', () => {
    test('backtop=undefined', async () => {
        let ref: Ref;
        const { unmount } = render(() => <Page title='title' ref={el => ref = el}>abc</Page>, {
            wrapper: Provider,
        });

        await sleep(500); // Provider 是异步的，需要等待其完成加载。

        expect(ref!.element()).not.toBeUndefined();
        expect(ref!.backtop()).not.toBeUndefined();

        unmount();
    });

    test('backtop=false', async () => {
        let ref: Ref;
        const { unmount } = render(() => <Page title='title' ref={el => ref = el} backtop={false}>abc</Page>, {
            wrapper: Provider,
        });

        await sleep(500); // Provider 是异步的，需要等待其完成加载。

        expect(ref!.element()).not.toBeUndefined();
        expect(ref!.backtop()).toBeUndefined();

        unmount();
    });
});
