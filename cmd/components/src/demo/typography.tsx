// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Description, Label } from '@cmfx/components';

import { Demo, paletteSelector, Stage } from './base';

export default function() {
    const [paletteS, palette] = paletteSelector();
    
    return <Demo settings={
        <>
            {paletteS}
        </>
    }>
        <Stage title="Label" class="w-full">
            <Label palette={palette()} icon='table_eye' tag='div'>Label</Label>
        </Stage>
    
        <Stage title="Description" class="w-full">
            <Description palette={palette()} icon='table_eye' title='title'>
                description<br />
                description
            </Description>
                
            <br />
            <br />
                
            <Description palette={palette()}>
                无标题<br />
                description
            </Description>
        </Stage>
    </Demo>;
}