// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Demo, paletteSelector, Stage } from '@admin/components/base/demo';
import { Description } from './description';
import { Label } from './label';

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