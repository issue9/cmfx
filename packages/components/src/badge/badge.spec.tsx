// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';
import { createSignal } from 'solid-js';

import { Badge, Corner } from './badge';
import { ComponentTester } from '@/context/context.spec';
import styles from './style.module.css';

describe('Badge', async () => {
    const [pos, setPos] = createSignal<Corner>();
    const ct = await ComponentTester.build(
        'Badge',
        props => <Badge pos={pos()} content="text" {...props}>abc</Badge>
    );

    test('props', async () => {
        const root = ct.result.container.firstChild;
        ct.testProps(root!.lastChild as Element);
    });

    test('pos=undefined', async () => {
        const c = ct.result.container.firstElementChild!;

        expect(c).toHaveClass(styles.badge);
        expect(c).toHaveTextContent('abc');

        const span = c.lastChild;
        expect(span).toHaveTextContent('text');
        expect(span).toHaveClass(styles.point);
        expect(span).toHaveClass(styles.topright);
    });

    test('pos=bottomleft', async () => {
        setPos('bottomleft');

        const c = ct.result.container.firstElementChild!;

        expect(c).toHaveClass(styles.badge);
        expect(c).toHaveTextContent('abc');

        const span = c.lastChild;
        expect(span).toHaveTextContent('text');
        expect(span).toHaveClass(styles.point);
        expect(span).toHaveClass(styles.bottomleft);
    });
});
