// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Spin } from '@cmfx/components';

import { Demo, boolSelector, paletteSelector } from './base';

export default function () {
    const [spinningS, spinning] = boolSelector('spinning', false);
    const [paletteS, palette] = paletteSelector('primary');

    return <Demo settings={
        <>
            {paletteS}
            {spinningS}
        </>
    }>
        <Spin palette={palette()} spinning={spinning()} class="border border-palette-bg-high flex gap-2 p-2 rounded-md">
            <button>btn1</button>
            <button>btn2</button>
        </Spin>

        <Spin palette={palette()} spinning={spinning()} class="border border-palette-bg-high flex gap-2 p-2">
            <Button>btn1</Button>
            <Button>btn2</Button>
        </Spin>

        <Spin palette={palette()} indicator={<span class="c--icon material-symbols-outlined">face</span>} spinning={spinning()} class="border border-palette-bg-high flex gap-2 p-2">
            <Button>btn1</Button>
            <p>indicator</p>
            <Button>btn2</Button>
        </Spin>

        <Spin palette={palette()} indicator={<span class="c--icon material-symbols-outlined animate-spin">progress_activity</span>} spinning={spinning()} class="border border-palette-bg-high flex gap-2 p-2">
            <Button>btn1</Button>
            <p>animate-spin indicator</p>
            <Button>btn2</Button>
        </Spin>
    </Demo>;
}
