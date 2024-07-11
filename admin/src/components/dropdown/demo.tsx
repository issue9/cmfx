// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';

import { Corner, Scheme } from '@/components/base';
import { CornerSelector, SchemeSelector } from '@/components/base/demo';
import { XButton } from '@/components/button';
import { default as XDropdown } from './dropdown';

export default function() {
    const [scheme, setScheme] = createSignal<Scheme>();
    const [pos, setPos] = createSignal<Corner>('bottomleft');
    const [visible, setVisible] = createSignal(false);

    return <div class="p-5 flex flex-col items-center gap-5">
        <div class="flex justify-around gap-2">
            <SchemeSelector set={setScheme} get={scheme} />
            <CornerSelector get={pos} set={setPos} />
        </div>

        <XDropdown pos={pos()} scheme={scheme()} visible={visible()} activator={
            <XButton scheme='primary' onClick={()=>setVisible(!visible())}>dropdown</XButton>
        }>
            <div class="p-4 z-5">dropdown</div>
        </XDropdown>

    </div>;
}
