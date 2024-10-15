// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { useOptions } from '@/app/context';
import { boolSelector, Demo, paletteSelector, Stage } from '@/components/base/demo';
import { FieldAccessor } from '../access';
import { default as Upload } from './upload';

export default function(): JSX.Element {
    const opt = useOptions();

    const [paletteS, palette] = paletteSelector('secondary');
    const [disabledS, disabled] = boolSelector('disabled');
    const [reverseS, reverse] = boolSelector('reverse');

    const basicA = FieldAccessor('upload', [opt.logo, './test.jpg'], true);

    return <Demo settings={
        <>
            {paletteS}
            {disabledS}
            {reverseS}
            <button class="c--button c--button-fill palette--primary" onClick={() => basicA.setError(basicA.getError() ? undefined : 'error')}>toggle error</button>
        </>
    } stages={
        <>
            <Stage title='basic'>
                <Upload label="basic" reverse={reverse()} droppable disabled={disabled()} palette={palette()} action='./' accessor={basicA} class='min-w-16' />
            </Stage>
        </>
    } />;
}
