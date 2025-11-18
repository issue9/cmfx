// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { joinClass, MountProps } from '@cmfx/components';
import * as illustrations from '@cmfx/illustrations';
import { createMemo } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '../base';

export default function(props: MountProps) {
    const [paletteS, palette] = paletteSelector();
    const [scaleS, scale] = boolSelector('缩放', false);

    const cls = createMemo(() => {
        return joinClass(undefined, scale() ? 'w-200' : 'w-150', 'p-4', 'bg-palette-bg');
    });

    return <>
        <Portal mount={props.mount}>
            {paletteS}
            {scaleS}
        </Portal>

        <illustrations.BUG class={cls()} palette={palette()} />
    </>;
}
