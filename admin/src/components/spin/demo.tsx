// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Demo, boolSelector, paletteSelector } from '@/components/base/demo';
import { Button } from '@/components/button';
import { Spin } from './spin';

export default function () {
    const [spinningS, spinning] = boolSelector('spinning', false);
    const [paletteS, palette] = paletteSelector('primary');

    return <Demo settings={
        <>
            {paletteS}
            {spinningS}
        </>
    }>
        <Spin palette={palette()} spinning={spinning()} class="border border-palette-bg-high flex gap-2 p-2">
            <button>btn1</button>
            <button>btn2</button>
        </Spin>

        <Spin palette={palette()} spinning={spinning()} class="border border-palette-bg-high flex gap-2 p-2">
            <Button>btn1</Button>
            <Button>btn2</Button>
        </Spin>

        <Spin palette={palette()} indicator={<span class="c--icon">face</span>} spinning={spinning()} class="border border-palette-bg-high flex gap-2 p-2">
            <Button>btn1</Button>
            <p>indicator</p>
            <Button>btn2</Button>
        </Spin>

        <Spin palette={palette()} indicator={<span class="c--icon animate-spin">progress_activity</span>} spinning={spinning()} class="border border-palette-bg-high flex gap-2 p-2">
            <Button>btn1</Button>
            <p>animate-spin indicator</p>
            <Button>btn2</Button>
        </Spin>
    </Demo>;
}
