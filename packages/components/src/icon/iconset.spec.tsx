// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';
import IconArrowDown from '~icons/material-symbols/keyboard-arrow-down';
import IconArrowRight from '~icons/material-symbols/keyboard-arrow-right';

import { ComponentTester } from '@/context/context.spec';
import { IconSet, Ref } from './iconset';

describe('IconSet', async () => {
    let ref: Ref;
    const ct = await ComponentTester.build(
        'IconSet',
        props => <IconSet ref={el => ref = el} {...props}
            icons={{ 'down': <IconArrowDown />, 'right': <IconArrowRight /> }} />,
    );

    test('props', () => ct.testProps());

    // ref 的初始化在 requestIdleCallback 之后。
    /*
    test('ref', () => {
        expect(ref).toBeDefined();
        expect(ref!.element()).toBeDefined();
    });
    */
});
