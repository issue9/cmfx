// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Album, FieldAccessor } from '@cmfx/components';
import { JSX } from 'solid-js';

import { boolSelector, Demo, paletteSelector, Stage } from '../base';

export default function(): JSX.Element {
    const [paletteS, palette] = paletteSelector('secondary');
    const [disabledS, disabled] = boolSelector('disabled');
    const [reverseS, reverse] = boolSelector('reverse');
    const [autoS, auto] = boolSelector('auto');
    const [horizontalS, horizontal] = boolSelector('horizontal', true);

    const basicA = FieldAccessor('upload', ['../../../../../cmd/admin/public/icon.svg', './test.jpg'], true);

    return <Demo settings={
        <>
            {paletteS}
            {disabledS}
            {reverseS}
            {autoS}
            {horizontalS}
            <button class="c--button c--button-fill palette--primary" onClick={() => basicA.setError(basicA.getError() ? undefined : 'error')}>toggle error</button>
        </>
    }>
        <Stage title='basic'>
            <Album horizontal={horizontal()} fieldName='file' label="label" class='min-w-16' reverse={reverse()} disabled={disabled()} palette={palette()} auto={auto()}
                action='./' accessor={basicA} />
        </Stage>

        <Stage title='basic+drop'>
            <Album horizontal={horizontal()} fieldName='file' class='min-w-16' reverse={reverse()} disabled={disabled()} palette={palette()} droppable auto={auto()}
                action='./' accessor={basicA} />
        </Stage>
    </Demo>;
}
