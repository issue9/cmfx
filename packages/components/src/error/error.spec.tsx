// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { render } from '@solidjs/testing-library';
import { describe, expect, test } from 'vitest';

import { Provider } from '@/context/context.spec';
import { sleep } from '@cmfx/core';
import { Error } from './error';

describe('Error', () => {
    test('title', async () => {
        const { container, unmount } = render(() => <Error title='title'>abc</Error>, {
            wrapper: Provider,
        });
        await sleep(500);
        const c = container.children.item(0)!;
        expect(c).toHaveClass('c--error');
        expect(c).toHaveTextContent('abc');
        expect(c.querySelector('.title')).toHaveTextContent('title');

        unmount();
    });

    test('detail', async () => {
        const { container, unmount } = render(() => <Error detail='detail'>abc</Error>, {
            wrapper: Provider,
        });
        await sleep(500);
        const c = container.children.item(0)!;
        expect(c).toHaveClass('c--error');
        expect(c.querySelector('.detail')).toHaveTextContent('detail');

        unmount();
    });
});