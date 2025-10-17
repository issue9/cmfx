// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { sleep } from '@cmfx/core';
import { render } from '@solidjs/testing-library';
import { describe, expect, test } from 'vitest';

import { Provider } from '@/context/context.spec';
import { Drawer, Ref } from './drawer';

describe('Drawer', () => {
    test('ref', async () => {
        let ref: Ref;
        const { unmount } = render(() => <Drawer main={<div>main</div>} ref={el => ref = el}>aside</Drawer>, {
            wrapper: Provider,
        });
        await sleep(500); // Provider 是异步的，需要等待其完成加载。

        expect(ref!.element()).not.toBeUndefined();
        expect(ref!.aside()).not.toBeUndefined();
        expect(ref!.main()).not.toBeUndefined();

        unmount();
    });
});
