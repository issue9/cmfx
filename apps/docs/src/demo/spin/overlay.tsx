// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Spin, MountProps } from '@cmfx/components';
import { Portal } from 'solid-js/web';
import IconFace from '~icons/material-symbols/face';

import { boolSelector, paletteSelector } from '../base';

export default function (props: MountProps) {
    const [spinningS, spinning] = boolSelector('spinning', false);
    const [paletteS, palette] = paletteSelector('primary');

    return <div>
        <Portal mount={props.mount}>
            {paletteS}
            {spinningS}
        </Portal>

        <Spin palette={palette()} indicator={<IconFace />} spinning={spinning()}
            class="border border-palette-border flex gap-2 p-2"
            overlayClass="bg-palette-bg/50 text-2xl"
        >
            <Button>btn1</Button>
            <p>overlay</p>
            <Button>btn2</Button>
        </Spin>
    </div>;
}
