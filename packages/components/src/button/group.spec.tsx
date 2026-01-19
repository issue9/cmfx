// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { ButtonGroup, Ref } from './group';
import { Button } from './button';

describe('ButtonGroup', async () => {
    let ref: Ref;
    const ct = await ComponentTester.build(
        'ButtonGroup',
        props => <ButtonGroup ref={el => ref = el} {...props}>
            <Button>btn1</Button>
        </ButtonGroup>
    );

    test('props', () => {
        ct.testProps();

        const root = ct.result.container.firstElementChild;
        expect(root).toHaveProperty('role', 'group');
    });

    test('ref', () => {
        expect(ref).toBeDefined();
        expect(ref.root()).toBeInstanceOf(HTMLFieldSetElement);
    });
});
