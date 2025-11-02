// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Spin, MountProps } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '../base';

export default function (props: MountProps) {
    const [spinningS, spinning] = boolSelector('spinning', false);
    const [paletteS, palette] = paletteSelector('primary');

    return <>
        <Portal mount={props.mount}>
            {paletteS}
            {spinningS}
        </Portal>

        <Spin palette={palette()} spinning={spinning()} class="border border-palette-bg-high flex gap-2 p-2">
            <Button>btn1</Button>
            <Button>btn2</Button>
        </Spin>
    </>;
}
