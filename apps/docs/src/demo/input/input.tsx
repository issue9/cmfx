// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Input, MountProps } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '../base';
import { createSignal } from 'solid-js';

export default function(props: MountProps) {
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [roundedS, rounded] = boolSelector('rounded');
    const [paletteS, palette] = paletteSelector();

    const prefix = <div class="bg-red-500 flex items-center">prefix</div>;
    const suffix = <div class="bg-red-500 flex items-center">suffix</div>;

    const [val, setVal] = createSignal('');

    return <>
        <Portal mount={props.mount}>
            {paletteS}
            {readonlyS}
            {roundedS}
            {disabledS}
        </Portal>

        <div class="flex flex-col gap-2 w-80">
            <Input placeholder='placeholder' palette={palette()} value={val()} onChange={v=>setVal(v)}
                disabled={disabled()} rounded={rounded()} readonly={readonly()} />

            <Input placeholder='placeholder' palette={palette()} prefix={prefix} suffix={suffix}
                disabled={disabled()} rounded={rounded()} readonly={readonly()} value={val()} onChange={v=>{
                    setVal(v);
                }} />

            <p>{ val() }</p>
        </div>
    </>;
}
