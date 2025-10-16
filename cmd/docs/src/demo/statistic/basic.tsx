// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Statistic } from '@cmfx/components';
import IconEye from '~icons/material-symbols/eyeglasses';

import { paletteSelector } from '../base';

export default function() {
    const [paletteS, palette] = paletteSelector('primary');
    return <div>
        {paletteS}
        <div class="flex gap-2">
            <Statistic label='basic' palette={palette()} value={5} />
            <Statistic label='basic' palette={palette()} value={500} icon={<IconEye class="text-[1em]" />} />
            <Statistic label='basic' palette={palette()} value={5} icon={<IconEye class="text-[1em]" />} formatter={v=>`${v}/5000`} />
        </div>
    </div>;
}
