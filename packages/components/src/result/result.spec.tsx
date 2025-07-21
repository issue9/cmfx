// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { sleep } from '@cmfx/core';
import { render } from '@solidjs/testing-library';
import { describe, expect, test } from 'vitest';

import { Provider } from '@/context/context.spec';
import { Result } from './result';
import styles from './style.module.css';

describe('Result', () => {
    test('title', async () => {
        const { container, unmount } = render(() => <Result title='title'>abc</Result>, {
            wrapper: Provider,
        });
        await sleep(500);
        const c = container.children.item(0)!;
        expect(c).toHaveClass(styles.error);
        expect(c).toHaveTextContent('abc');
        expect(document.title).toContain('title');

        unmount();
    });
});
