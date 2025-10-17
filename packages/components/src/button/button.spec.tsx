// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { sleep } from '@cmfx/core';
import { render } from '@solidjs/testing-library';
import { describe, expect, test } from 'vitest';

import { Provider } from '@/context/context.spec';
import { Button, Ref } from './button';

describe('Button', () => {
    test('ref', async () => {
        let ref: Ref;
        const { unmount } = render(() => <Button ref={el=>ref=el}>button</Button>, {
            wrapper: Provider,
        });
        await sleep(500); // Provider 是异步的，需要等待其完成加载。

        expect(ref!.element()).not.toBeUndefined();

        unmount();
    });
});
