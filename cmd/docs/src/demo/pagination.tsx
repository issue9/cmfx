// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Pagination, PaginationBar } from '@cmfx/components';
import { createSignal } from 'solid-js';

import { Demo, paletteSelector, Stage } from './base';

export default function() {
    const [paletteS, palette] = paletteSelector();
    const [page, setPage] = createSignal('');
    const [spans, setSpans] = createSignal(3);

    return <Demo settings={
        <>
            {paletteS}
            <input type="number" value={spans()} onchange={(e) => setSpans(parseInt(e.target.value))} placeholder='spans' />
        </>
    }>
        <Stage title="Pagination" class="w-full p-4 border border-palette-fg">
            <Pagination palette={palette()} count={10} value={5} spans={spans()}
                onChange={(val, old) => { return setPage(`new:${val}, old:${old}`); }} />
            <pre>{page()}</pre>
        </Stage>

        <Stage title="PaginationBar" class="w-full p-4 border border-palette-fg">
            <PaginationBar palette={palette()} total={100} page={2} size={20} />
        </Stage>
    </Demo>;
}
