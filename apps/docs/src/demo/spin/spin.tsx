// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, MountProps, Spin } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '../base';

export default function (props: MountProps) {
    const [Spinning, spinning] = boolSelector('spinning', false);
    const [Palette, palette] = paletteSelector('primary');

    return <>
        <Portal mount={props.mount}>
            <Palette />
            <Spinning />
        </Portal>

        <Spin palette={palette()} spinning={spinning()} class="border border-palette-bg-high flex gap-2 p-2">
            <Button>btn1</Button>
            <Button>btn2</Button>
        </Spin>
    </>;
}
