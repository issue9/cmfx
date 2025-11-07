// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import Result from './result';
import styles from './style.module.css';

describe('Result', async () => {
    const ct = await ComponentTester.build(
        'Result',
        props => <Result title='title' {...props}>abc</Result>
    );

    test('title', async () => {
        const c = ct.result.container.firstElementChild!;
        expect(c).toHaveClass(styles.result);
        expect(c).toHaveTextContent('abc');
    });

    test('props', () => ct.testProps());
});
