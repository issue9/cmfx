// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { render } from '@solidjs/testing-library';
import { describe, expect, test } from 'vitest';

import { Icon } from './icon';

describe('Icon', async () => {
    test('preset', async () => {
        const { container, unmount } = render(() => <Icon icon='face' />);
        const c = container.children.item(0)!;

        expect(c).toHaveClass('c--icon material-symbols-outlined');
        expect(c).toHaveRole('img');

        unmount();
    });

    test('class=abc', async () => {
        const { container, unmount } = render(() => <Icon icon='face' class='abc' />);
        const c = container.children.item(0)!;

        expect(c).toHaveClass('c--icon material-symbols-outlined abc');
        expect(c).toHaveRole('img');

        unmount();
    });
});
