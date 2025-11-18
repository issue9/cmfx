// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { MountProps } from '@cmfx/components';
import * as illustrations from '@cmfx/illustrations';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '../base';

export default function(props: MountProps) {
    const [paletteS, palette] = paletteSelector();
    const [customS, custom] = boolSelector('自定义文字内容', false);

    return <>
        <Portal mount={props.mount}>
            {paletteS}
            {customS}
        </Portal>

        <illustrations.Error503 class='bg-palette-bg aspect-square w-full' palette={palette()} text={custom() ? '服 务 暂 不 可 用' : undefined} />
    </>;
}
