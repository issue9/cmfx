// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Timezone } from '@cmfx/components';
import { createSignal } from 'solid-js';

import { paletteSelector } from '../../base';

export default function () {
    const [paletteS, palette] = paletteSelector('primary');
    const [timezone, setTimezone] = createSignal<string>('Asia/Shanghai');

    return <div>
        {paletteS}
        <br />
        <Timezone value={timezone()} palette={palette()} onChange={d => setTimezone(d)} />
        <span>{timezone()}</span>
    </div>;
}
