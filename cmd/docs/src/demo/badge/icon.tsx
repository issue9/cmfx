// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Badge, badgeCorners, Button } from '@cmfx/components';
import { For } from 'solid-js';
import IconFace from '~icons/material-symbols/face';

import { paletteSelector } from '../base';

export default function () {
    const [paletteS, palette] = paletteSelector();

    return <div>
        {paletteS}
        <div class="flex flex-wrap gap-3 justify-start">
            <For each={badgeCorners}>
                {pos => (
                    <Badge pos={pos} palette={palette()} content={<IconFace />}>
                        <Button palette='primary'>{pos}</Button>
                    </Badge>
                )}
            </For>
        </div>
    </div>;
}
