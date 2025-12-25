// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { MountProps, Statistic } from '@cmfx/components';
import { Portal } from 'solid-js/web';
import IconEye from '~icons/material-symbols/eyeglasses';

import { paletteSelector } from '../base';

export default function(props: MountProps) {
    const [Palette, palette] = paletteSelector('primary');
    return <div>
        <Portal mount={props.mount}>
            <Palette />
        </Portal>

        <div class="flex gap-2">
            <Statistic label='basic' palette={palette()} value={5} />
            <Statistic label='basic' palette={palette()} value={500} icon={<IconEye class="text-[1em]" />} />
            <Statistic label='basic' palette={palette()} value={5} icon={<IconEye class="text-[1em]" />} formatter={v => `${v}/5000`} />
        </div>
    </div>;
}
