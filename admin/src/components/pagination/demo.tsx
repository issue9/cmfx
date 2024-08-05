// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';

import { Demo, paletteSelector } from '@/components/base/demo';
import { default as Pagination } from './pagination';

export default function() {
    const [paletteS, palette] = paletteSelector();
    const [page, setPage] = createSignal('');
    const [spans, setSpans] = createSignal(3);

    return <Demo settings={
        <>
            {paletteS}
            <input type="number" value={spans()} onchange={(e)=>setSpans(parseInt(e.target.value))} placeholder='spans' />
        </>
    } stages={
        <>
            <div>
                <Pagination palette={palette()} count={10} value={5} spans={spans()}
                    onChange={(val,old)=>{return setPage(`new:${val}, old:${old}`);}} />
                <pre>{page()}</pre>
            </div>
        </>
    } />;
}
