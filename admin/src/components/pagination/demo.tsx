// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';

import { Demo, paletteSelector } from '@/components/base/demo';
import {default as Pagination} from './pagination';

export default function() {
    const [paletteS, palette] = paletteSelector();
    const [page, setPage] = createSignal('');

    return <Demo settings={
        <>
            {paletteS}
        </>
    } stages={
        <>
            <div>
                <Pagination onChange={(val,old)=>{return setPage(`new:${val}, old:${old}`);}} palette={palette()} count={10} value={5} />
                <pre>{page()}</pre>
            </div>
        </>
    } />;
}
