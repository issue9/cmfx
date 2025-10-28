// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { sleep } from '@cmfx/core';
import { render } from '@solidjs/testing-library';
import { describe, expect, test } from 'vitest';

import { Provider } from '@/context/context.spec';
import { default as Nav, Ref } from './nav';

describe('Nav', () => {
    test('ref', async () => {
        let ref: Ref;
        const { unmount } = render(() => <Nav target={ref.element()} ref={el => ref = el} />, {
            wrapper: Provider,
        });

        await sleep(500); // Provider 是异步的，需要等待其完成加载。

        expect(ref!.element()).not.toBeUndefined();

        unmount();
    });
});
