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
        let articleRef: HTMLElement;
        const { unmount } = render(() => <div>
            <article ref={el => articleRef = el}>
                <h1>head1</h1>
                <h2>head2</h2>
            </article>
            <Nav target={articleRef} ref={el => ref = el} />
        </div>, {
            wrapper: Provider,
        });

        await sleep(500); // Provider 是异步的，需要等待其完成加载。

        expect(ref!.element()).not.toBeUndefined();

        unmount();
    });
});
