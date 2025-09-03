// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { PaginationBar } from '@cmfx/components';
import { createSignal } from 'solid-js';

import { paletteSelector } from '../base';

export default function() {
    const [paletteS, palette] = paletteSelector();
    const [spans, setSpans] = createSignal(3);

    return <div>
        {paletteS}
        <input type="number" value={spans()} onchange={(e) => setSpans(parseInt(e.target.value))} placeholder='spans' />
        <PaginationBar palette={palette()} total={100} page={2} size={20} />
    </div>;
}
