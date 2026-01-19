// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, MountProps, Spin } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconFace from '~icons/material-symbols/face';

import { boolSelector, paletteSelector } from '@docs/components/base';

export default function (props: MountProps): JSX.Element {
    const [Spinning, spinning] = boolSelector('spinning', false);
    const [Palette, palette] = paletteSelector('primary');

    return <div>
        <Portal mount={props.mount}>
            <Palette />
            <Spinning />
        </Portal>

        <Spin palette={palette()} indicator={<IconFace />} spinning={spinning()} class="border border-palette-border flex gap-2 p-2">
            <Button>btn1</Button>
            <p>indicator</p>
            <Button>btn2</Button>
        </Spin>

        <Spin palette={palette()} indicator={<IconFace class="animate-spin" />} spinning={spinning()} class="border border-palette-border flex gap-2 p-2">
            <Button>btn1</Button>
            <p>animate-spin indicator</p>
            <Button>btn2</Button>
        </Spin>
    </div>;
}
