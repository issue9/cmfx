// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { render } from '@solidjs/testing-library';
import { describe, expect, test } from 'vitest';

import { Badge } from './badge';
import styles from './style.module.css';

describe('Badge', async () => {
    test('pos=undefined,palette=undefined', async () => {
        const { container, unmount } = render(() => <Badge content={'text'}>abc</Badge>);
        const c = container.children.item(0)!;

        expect(c).toHaveClass(styles.badge);
        expect(c).toHaveTextContent('abc');

        const span = c.lastChild;
        expect(span).toHaveTextContent('text');
        expect(span).toHaveClass(styles.point);
        expect(span).toHaveClass(styles.topright);
        expect(span).not.toHaveClass('palette-/');

        unmount();
    });

    test('pos=bottomleft,palette=primary', async () => {
        const { container, unmount } = render(() => <Badge pos='bottomleft' content={'text'}>abc</Badge>);
        const c = container.children.item(0)!;

        expect(c).toHaveClass(styles.badge);
        expect(c).toHaveTextContent('abc');

        const span = c.lastChild;
        expect(span).toHaveTextContent('text');
        expect(span).toHaveClass(styles.point);
        expect(span).toHaveClass(styles.bottomleft);
        expect(span).not.toHaveClass('palette--primary');

        unmount();
    });
});
