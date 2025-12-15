// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { ToggleFitScreenButton, ToggleFullScreenButton } from './toggle';

describe('ToggleFullScreenButton', async () => {
    const ct = await ComponentTester.build(
        'ToggleFullScreenButton',
        props => <ToggleFullScreenButton {...props}>abc</ToggleFullScreenButton>
    );

    test('props', () => ct.testProps());
});

describe('ToggleFitScreenButton', async () => {
    let container: HTMLDivElement;
    const ct = await ComponentTester.build(
        'ToggleFitScreenButton',
        props => <div ref={el => container = el}>
            <ToggleFitScreenButton container={ container } {...props} />
        </div>
    );

    test('props', () => ct.testProps(ct.result.container.firstElementChild!.firstElementChild!));
});
