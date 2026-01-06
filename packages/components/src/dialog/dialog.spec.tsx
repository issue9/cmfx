// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { Dialog, Ref } from './dialog';
import styles from './style.module.css';

describe('Dialog', async () => {
    let ref!: Ref;
    const ct = await ComponentTester.build('Dialog', props => <Dialog {...props} ref={el => ref = el}>abc</Dialog>);

    test('move', async () => {
        const c = ct.result.container.firstElementChild as HTMLElement;
        expect(c).toHaveClass(styles.dialog);

        ref.move({ x: 10, y: 10 });
        expect(c.style.insetInlineStart).toEqual('10px');
        expect(c.style.insetBlockStart).toEqual('10px');
        expect(c.style.translate).toEqual('0px 0px');

        ref.move();
        expect(c.style.insetInlineStart).toEqual('50%');
        expect(c.style.insetBlockStart).toEqual('50%');
        expect(c.style.translate).toEqual('var(--tw-translate-x) var(--tw-translate-y)');
    });

    test('props', () => ct.testProps());

    test('ref', async () => {
        expect(ref.root()).toBeDefined();
    });
});
