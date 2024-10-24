// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { useOptions } from '@/app/context';
import { boolSelector, Demo, paletteSelector, Stage } from '@/components/base/demo';
import { FieldAccessor } from '../access';
import { default as Album } from './album';

export default function(): JSX.Element {
    const opt = useOptions();

    const [paletteS, palette] = paletteSelector('secondary');
    const [disabledS, disabled] = boolSelector('disabled');
    const [reverseS, reverse] = boolSelector('reverse');
    const [autoS, auto] = boolSelector('auto');

    const basicA = FieldAccessor('upload', [opt.logo, './test.jpg'], true);

    return <Demo settings={
        <>
            {paletteS}
            {disabledS}
            {reverseS}
            {autoS}
            <button class="c--button c--button-fill palette--primary" onClick={() => basicA.setError(basicA.getError() ? undefined : 'error')}>toggle error</button>
        </>
    } stages={
        <>
            <Stage title='basic'>
                <Album fieldName='file' label="label" class='min-w-16' reverse={reverse()} disabled={disabled()} palette={palette()} auto={auto()}
                    action='./' accessor={basicA} />
            </Stage>

            <Stage title='basic+drop'>
                <Album fieldName='file' class='min-w-16' reverse={reverse()} disabled={disabled()} palette={palette()} droppable auto={auto()}
                    action='./' accessor={basicA} />
            </Stage>
        </>
    } />;
}
