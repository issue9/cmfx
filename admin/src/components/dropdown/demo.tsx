// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';
import XDropdown from './dropdown';

export default function() {
    const [clickShow, setClickShow] = createSignal(false);
    const [hoverShow, setHoverShow] = createSignal(false);

    document.body.addEventListener('click', () => {
        setClickShow(false);
    });

    return <div class="w-80 p-5 flex justify-around">
        <div>
            <button class="button scheme--primary filled" onClick={()=>setClickShow(!clickShow())}>click</button>
            <XDropdown show={clickShow()}>
                <div class="bg-red-500 p-4 z-5">dropdown</div>
            </XDropdown >
        </div>

        <div onMouseEnter={()=>setHoverShow(true)} onMouseLeave={()=>setHoverShow(false)}>
            <button class="button scheme--primary filled">hover</button>
            <XDropdown show={hoverShow()}>
                <div class="bg-red-500 p-4 z-5" onClick={() => { setHoverShow(false); }}>hover, click to close</div>
            </XDropdown >
        </div>

    </div>;
}
