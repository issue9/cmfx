// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Badge, badgeCorners, Button, MountProps } from '@cmfx/components';
import { For } from 'solid-js';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '../base';

export default function (props: MountProps) {
    const [Palette, palette] = paletteSelector();

    return <div>
        <Portal mount={props.mount}>
            <Palette />
        </Portal>

        <div class="flex flex-wrap gap-3 justify-start">
            <For each={badgeCorners}>
                {pos => (
                    <Badge pos={pos} palette={palette()} content="这是一段很长的文字内容">
                        <Button palette='primary'>{pos}</Button>
                    </Badge>
                )}
            </For>
        </div>
    </div>;
}
