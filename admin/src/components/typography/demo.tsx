// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Demo, paletteSelector, Stage } from '@/components/base/demo';
import { Description } from './description';
import { Label } from './label';

export default function() {
    const [paletteS, palette] = paletteSelector();
    
    return <Demo settings={
        <>
            {paletteS}
        </>
    } stages={
        <>
            <Stage title="Label" class="w-full">
                <Label palette={palette()} icon='table_eye' tag='div'>Label</Label>
            </Stage>
    
            <Stage title="Description" class="w-full">
                <Description palette={palette()} icon='table_eye' title='title'>
                    description<br />
                    description
                    
                    <p>直属的 P 标签会自动缩进两个空格。</p>
                    <p>直属的 P 标签会自动缩进两个空格。直属的 P 标签会自动缩进两个空格。直属的 P 标签会自动缩进两个空格。直属的 P 标签会自动缩进两个空格。直属的 P 标签会自动缩进两个空格。直属的 P 标签会自动缩进两个空格。</p>
                </Description>
                
                <br />
                <br />
                
                <Description palette={palette()}>
                    <p>直属的 P 标签会自动缩进两个空格。</p>
                    <p>直属的 P 标签会自动缩进两个空格。直属的 P 标签会自动缩进两个空格。直属的 P 标签会自动缩进两个空格。直属的 P 标签会自动缩进两个空格。直属的 P 标签会自动缩进两个空格。直属的 P 标签会自动缩进两个空格。</p>
                </Description>
            </Stage>
        </>
    } />;
}