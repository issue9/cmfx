// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { render } from '@solidjs/testing-library';
import { describe, expect, test } from 'vitest';

import { Badge } from './badge';

describe('Badge', async () => {
    test('pos=undefined,palette=undefined', async () => {
        const { container, unmount } = render(() => <Badge text={'text'}>abc</Badge>);
        const c = container.children.item(0)!;

        expect(c).toHaveClass('c--badge');
        expect(c).toHaveTextContent('abc');

        const span = c.lastChild;
        expect(span).toHaveTextContent('text');
        expect(span).toHaveClass('point');
        expect(span).toHaveClass('topright');
        expect(span).not.toHaveClass('palette-/');

        unmount();
    });

    test('pos=bottomleft,palette=primary', async () => {
        const { container, unmount } = render(() => <Badge pos='bottomleft' text={'text'}>abc</Badge>);
        const c = container.children.item(0)!;

        expect(c).toHaveClass('c--badge');
        expect(c).toHaveTextContent('abc');

        const span = c.lastChild;
        expect(span).toHaveTextContent('text');
        expect(span).toHaveClass('point');
        expect(span).toHaveClass('bottomleft');
        expect(span).not.toHaveClass('palette--primary');

        unmount();
    });
});
