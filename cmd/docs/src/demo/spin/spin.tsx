// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Spin } from '@cmfx/components';
import IconFace from '~icons/material-symbols/face';

import { boolSelector, paletteSelector } from '../base';

export default function () {
    const [spinningS, spinning] = boolSelector('spinning', false);
    const [paletteS, palette] = paletteSelector('primary');

    return <div>
        {paletteS}
        {spinningS}

        <Spin palette={palette()} spinning={spinning()} class="border border-palette-bg-high flex gap-2 p-2 rounded-md">
            <button>btn1</button>
            <button>btn2</button>
        </Spin>

        <Spin palette={palette()} spinning={spinning()} class="border border-palette-bg-high flex gap-2 p-2">
            <Button>btn1</Button>
            <Button>btn2</Button>
        </Spin>

        <Spin palette={palette()} indicator={<IconFace />} spinning={spinning()} class="border border-palette-bg-high flex gap-2 p-2">
            <Button>btn1</Button>
            <p>indicator</p>
            <Button>btn2</Button>
        </Spin>

        <Spin palette={palette()} indicator={<IconFace class="animate-spin" />} spinning={spinning()} class="border border-palette-bg-high flex gap-2 p-2">
            <Button>btn1</Button>
            <p>animate-spin indicator</p>
            <Button>btn2</Button>
        </Spin>
    </div>;
}
