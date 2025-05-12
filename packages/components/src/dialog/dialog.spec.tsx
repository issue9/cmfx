// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { sleep } from '@cmfx/core';
import { render } from '@solidjs/testing-library';
import { describe, expect, test } from 'vitest';

import { Provider } from '@/context/context.spec';
import { Dialog, Ref } from './dialog';

describe('Dialog', () => {
    test('move', async () => {
        let ref: Ref;
        const { container, unmount } = render(() => <Dialog ref={el => ref = el}>abc</Dialog>, {
            wrapper: Provider,
        });
        await sleep(500); // Provider 是异步的，需要等待其完成加载。
        const c = container.children.item(0)! as HTMLElement;
        expect(c).toHaveClass('c--dialog');

        ref!.move({ x: 10, y: 10 });
        expect(c.style.left).toEqual('10px');
        expect(c.style.top).toEqual('10px');
        expect(c.style.translate).toEqual('0px 0px');

        ref!.move();
        expect(c.style.left).toEqual('50%');
        expect(c.style.top).toEqual('50%');
        expect(c.style.translate).toEqual('var(--tw-translate-x) var(--tw-translate-y)');

        unmount();
    });
});