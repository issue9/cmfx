// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Statistics } from '@cmfx/components';

import IconEye from '~icons/material-symbols/eyeglasses';
import { Demo, paletteSelector, Stage } from './base';

export default function() {
    const [paletteS, palette] = paletteSelector('primary');
    return <Demo settings={<>
        {paletteS}
    </>}>
        <Stage title="1">
            <Statistics palette={palette()} items={[
                ['statistic1', 5],
                ['statistic2', 5000],
                ['statistic3', '5/500'],
            ]} />
        </Stage>

        <Stage title="icon" class="w-full">
            <Statistics palette={palette()} items={[
                ['statistic1', 5, IconEye],
                ['statistic2', 5000, IconEye],
                ['statistic3', '5/500', IconEye],
            ]} />
        </Stage>
    </Demo>;
}
