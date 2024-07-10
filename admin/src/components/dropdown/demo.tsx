// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';

import { Color } from '@/components/base';
import { ColorSelector } from '@/components/base/demo';
import XDropdown from './dropdown';

export default function() {
    const [clickShow, setClickShow] = createSignal(false);
    const [hoverShow, setHoverShow] = createSignal(false);
    const [c, setC] = createSignal<Color>();

    document.body.addEventListener('click', () => {
        setClickShow(false);
    });

    return <div class="w-80 p-5 flex justify-around">
        <ColorSelector setter={setC} getter={c} />

        <div>
            <button class="button scheme--primary filled" onClick={()=>setClickShow(!clickShow())}>click</button>
            <XDropdown show={clickShow()} color={c()}>
                <div class="p-4 z-5">dropdown</div>
            </XDropdown >
        </div>

        <div onMouseEnter={()=>setHoverShow(true)} onMouseLeave={()=>setHoverShow(false)}>
            <button class="button scheme--primary filled">hover</button>
            <XDropdown show={hoverShow()} color={c()}>
                <div class="p-4 z-5" onClick={() => { setHoverShow(false); }}>hover, click to close</div>
            </XDropdown >
        </div>

    </div>;
}
