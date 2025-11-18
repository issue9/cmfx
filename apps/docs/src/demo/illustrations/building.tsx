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
    const [customS, custom] = boolSelector('自定义文字内容', false);
    const [scaleS, scale] = boolSelector('缩放', false);

    const cls = createMemo(() => {
        return joinClass(undefined, scale() ? 'w-200' : 'w-150', 'p-4', 'bg-palette-bg');
    });

    return <>
        <Portal mount={props.mount}>
            {paletteS}
            {customS}
            {scaleS}
        </Portal>

        <illustrations.Building class={cls()} palette={palette()} text={custom() ? '升级中...' : undefined} />
    </>;
}
