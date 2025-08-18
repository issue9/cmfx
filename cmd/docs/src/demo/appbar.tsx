// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Appbar, Button } from '@cmfx/components';
import IconEye from '~icons/material-symbols/eyeglasses';

import { Demo, paletteSelector, Stage } from './base';

export default function() {
    const [paletteS, palette] = paletteSelector();
    
    return <Demo settings={
        <>
            {paletteS}
        </>
    }>
        <Stage title="Appbar" class="w-full">
            <Appbar palette={palette()} title="title" logo="LOGO" actions={
                <>
                    <Button square><IconEye /></Button>
                    <Button square><IconEye /></Button>
                </>
            }>
                <IconEye />
            </Appbar>
        </Stage>
    </Demo>;
}