// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Badge, badgeCorners, Button } from '@cmfx/components';
import { For } from 'solid-js';
import IconFace from '~icons/material-symbols/face';

import { paletteSelector, boolSelector } from '../base';

export default function () {
    const [paletteS, palette] = paletteSelector();
    const [roundedS, rounded] = boolSelector('rounded', false);

    return <div>
        {paletteS}
        {roundedS}
        <div class="flex flex-wrap gap-3 justify-start">
            <For each={badgeCorners}>
                {pos => (
                    <Badge pos={pos} rounded={rounded()} palette={palette()} content={<IconFace />}>
                        <Button palette='primary'>{pos}</Button>
                    </Badge>
                )}
            </For>
        </div>
    </div>;
}
