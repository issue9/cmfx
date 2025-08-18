// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Empty } from '@cmfx/components';
import IconEye from '~icons/material-symbols/eyeglasses';

import { Demo, paletteSelector, Stage } from './base';

export default function() {
    const [paletteS, palette] = paletteSelector();
    
    return <Demo settings={
        <>
            {paletteS}
        </>
    }>
        <Stage title="default">
            <Empty palette={palette()} />
        </Stage>

        <Stage title="自定义图标">
            <Empty palette={palette()} icon={IconEye}>说点什么呢？</Empty>
        </Stage>
    </Demo>;
}