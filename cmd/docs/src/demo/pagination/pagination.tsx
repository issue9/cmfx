// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Pagination } from '@cmfx/components';
import { createSignal } from 'solid-js';

import { paletteSelector } from '../base';

export default function() {
    const [paletteS, palette] = paletteSelector();
    const [page, setPage] = createSignal('');
    const [spans, setSpans] = createSignal(3);

    return <div>
        {paletteS}
        <input type="number" value={spans()} onchange={(e) => setSpans(parseInt(e.target.value))} placeholder='spans' />
        <Pagination palette={palette()} count={10} value={5} spans={spans()}
            onChange={(val, old) => { return setPage(`new:${val}, old:${old}`); }} />
        <pre>{page()}</pre>
    </div>;
}
