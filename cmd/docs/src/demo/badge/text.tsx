// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Badge, badgeCorners, Button, MountProps } from '@cmfx/components';
import { For } from 'solid-js';
import { Portal } from 'solid-js/web';

import { paletteSelector, boolSelector } from '../base';

export default function (props: MountProps) {
    const [paletteS, palette] = paletteSelector();
    const [roundedS, rounded] = boolSelector('rounded', false);

    return <div>
        <Portal mount={props.mount}>
            {paletteS}
            {roundedS}
        </Portal>

        <div class="flex flex-wrap gap-3 justify-start">
            <For each={badgeCorners}>
                {pos => (
                    <Badge rounded={rounded()} pos={pos} palette={palette()} content="99+">
                        <Button palette='primary'>{pos}</Button>
                    </Badge>
                )}
            </For>
        </div>
    </div>;
}
