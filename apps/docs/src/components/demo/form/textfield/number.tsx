// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, fieldAccessor, MountProps, Number } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconFace from '~icons/material-symbols/face';

import { boolSelector, layoutSelector, paletteSelector } from '@docs/components/base';

export default function(props: MountProps): JSX.Element {
    const num = fieldAccessor('name', 5);

    const [Palette, palette] = paletteSelector();
    const [Disabled, disabled] = boolSelector('_d.demo.disabled');
    const [Readonly, readonly] = boolSelector('_d.demo.readonly');
    const [Layout, layout] = layoutSelector('_d.demo.componentLayout', 'horizontal');
    const [Rounded, rounded] = boolSelector('_d.demo.rounded', false);

    return <>
        <Portal mount={props.mount}>
            <Palette />
            <Readonly />
            <Rounded />
            <Disabled />
            <Layout />
            <Button palette="primary" onclick={() => {
                num.setError(num.getError() ? undefined : 'error');
            }}>toggle error</Button>
        </Portal>

        <div class="flex flex-col gap-2 w-80">
            <Number hasHelp layout={layout()} placeholder='placeholder' palette={palette()}
                disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={num} />
            <Number hasHelp layout={layout()} placeholder='placeholder' label="icon"
                prefix={<IconFace class='self-center' />} palette={palette()} disabled={disabled()}
                rounded={rounded()} readonly={readonly()} accessor={num} />
            <Number hasHelp layout={layout()} placeholder='placeholder' label="range:[1,10]"
                prefix={<IconFace class='self-center' />} min={1} max={10} palette={palette()}
                disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={num} />
        </div>
    </>;
}
