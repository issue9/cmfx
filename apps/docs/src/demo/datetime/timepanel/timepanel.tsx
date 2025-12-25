// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, MountProps, TimePanel } from '@cmfx/components';
import { createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '../../base';

export default function(props: MountProps) {
    const [Palette, palette] = paletteSelector('primary');
    const [Disabled, disabled] = boolSelector('_d.demo.disabled');
    const [Readonly, readonly] = boolSelector('_d.demo.readonly');

    const [val, setValue] = createSignal<Date | undefined>(undefined);
    const [valShow, setValShow] = createSignal<string>('');

    return <div>
        <Portal mount={props.mount}>
            <Palette />
            <Disabled />
            <Readonly />
            <Button onclick={() => setValue()}>set undefined</Button>
            <Button onclick={() => setValue(new Date())}>now</Button>
        </Portal>

        <div class="flex items-start flex-col">
            <TimePanel palette={palette()} readonly={readonly()} disabled={disabled()} value={val()}
                onChange={(val, old) => {
                    setValShow(`new:${val}old:${old}`);
                    setValue(val);
                }} />
            <p>{valShow()}</p>
        </div>
    </div>;
}
