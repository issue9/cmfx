// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { render } from '@solidjs/testing-library';
import { describe, expect, test } from 'vitest';

import { joinClass } from '@/base';
import { Divider } from './divider';
import styles from './style.module.css';

describe('Divider', async () => {
    test('pos=undefined', async () => {
        const { container, unmount } = render(() => <Divider>abc</Divider>);
        const c = container.children.item(0)!;

        expect(c).toHaveClass(styles.divider);
        expect(c).toHaveTextContent('abc');

        unmount();
    });

    test('pos=end', async () => {
        const { container, unmount } = render(() => <Divider pos='end'>abc</Divider>);
        const c = container.children.item(0)!;

        expect(c).toHaveClass(joinClass(undefined, styles.divider, styles['pos-end'])!);
        expect(c).toHaveTextContent('abc');

        unmount();
    });

    test('pos=center', async () => {
        const { container, unmount } = render(() => <Divider pos='center'>abc</Divider>);
        const c = container.children.item(0)!;

        expect(c).toHaveClass(joinClass(undefined, styles.divider, styles['pos-center'])!);
        expect(c).toHaveTextContent('abc');

        unmount();
    });
});
