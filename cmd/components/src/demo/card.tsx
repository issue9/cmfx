// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Card, Label } from '@cmfx/components';

import { Demo, paletteSelector, Stage } from './base';

export default function() {
    const [paletteS, palette] = paletteSelector();
    
    return <Demo settings={
        <>
            {paletteS}
        </>
    }>
        <Stage title="Description" class="w-full">
            <Card palette={palette()} header={<Label icon='eyeglasses'>title</Label>}>
                <p>这是一行文字</p>
                <Button palette='primary'>button</Button>
            </Card>
                
            <Card palette={palette()}>
                <p>不带标题</p>
                <Button palette='primary'>button</Button>
            </Card>
        </Stage>
    </Demo>;
}