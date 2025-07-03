// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { fieldAccessor, OKLCHPanel, OKLCHPicker } from '@cmfx/components';

import { boolSelector, Demo, layoutSelector, paletteSelector, Stage } from '../base';

export default function() {
    const [layoutS, layout] = layoutSelector('布局', 'horizontal');
    const [roundedS, rounded] = boolSelector('rounded');
    const [apcaS, apca] = boolSelector('APCA');
    const [paletteS, palette] = paletteSelector();

    const color = fieldAccessor('color', 'oklch(1% 0.3 100)');
    const wcag = fieldAccessor('wcag', 'oklch(1% 0.11 10)');

    return <Demo settings={
        <>
            {paletteS}
            {layoutS}
            {roundedS}
            {apcaS}
        </>
    }>
        <Stage title='panel'>
            <OKLCHPanel palette={palette()} accessor={color} />
        </Stage>

        <Stage title='wcag'>
            <OKLCHPicker palette={palette()} layout={layout()} accessor={wcag} label='wcag' rounded={rounded()} />
            <OKLCHPanel palette={palette()} apca={apca()} accessor={color} wcag={wcag.getValue()} />
        </Stage>

        <Stage title='picker'>
            <OKLCHPicker palette={palette()} layout={layout()} accessor={color} label='picker label' rounded={rounded()} />
        </Stage>
    </Demo>;
}
