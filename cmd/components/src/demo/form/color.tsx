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
            <OKLCHPanel palette={palette()} apca={apca()} accessor={color} wcag={wcag.getValue()} presets={[
                'oklch(1 0 0)', 'oklch(0 0 0)', 'oklch(.5 .2 20)', 'oklch(.5 .2 40)', 'oklch(.5 .2 60)',
                'oklch(.5 .2 80)', 'oklch(.5 .2 100)', 'oklch(.5 .2 120)', 'oklch(.5 .2 140)', 'oklch(.5 .2 160)',
                'oklch(.5 .2 180)', 'oklch(.5 .2 200)', 'oklch(.5 .2 220)', 'oklch(.5 .2 240)', 'oklch(.5 .2 260)',
                'oklch(.5 .2 280)', 'oklch(.5 .2 300)', 'oklch(.5 .2 320)', 'oklch(.5 .2 340)', 'oklch(.5 .2 360)',
            ]} />
        </Stage>

        <Stage title='picker'>
            <OKLCHPicker wcag='oklch(1 0 0)' apca={apca()} palette={palette()} layout={layout()} accessor={color} label='picker label' rounded={rounded()} />
        </Stage>
    </Demo>;
}
