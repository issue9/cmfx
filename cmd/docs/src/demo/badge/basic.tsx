// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Badge, badgeCorners, Button } from '@cmfx/components';
import { For } from 'solid-js';

import { paletteSelector, boolSelector } from '../base';

export default function () {
    const [paletteS, palette] = paletteSelector();
    const [roundedS, rounded] = boolSelector('rounded', false);

    return <div class="">
        {paletteS}
        {roundedS}
        <div class="flex flex-wrap gap-3 justify-start">
            <For each={badgeCorners}>
                {pos => (
                    <Badge rounded={rounded()} pos={pos} palette={palette()}>
                        <Button palette='primary'>{pos}</Button>
                    </Badge>
                )}
            </For>
        </div>
    </div>;
}
