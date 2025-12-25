// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, cloneElement, fieldAccessor, MountProps, TextField } from '@cmfx/components';
import { Portal } from 'solid-js/web';
import IconFace from '~icons/material-symbols/face';

import { boolSelector, layoutSelector, paletteSelector } from '../../base';

export default function(props: MountProps) {
    const txt = fieldAccessor('name', 'text');

    const [Palette, palette] = paletteSelector();
    const [Disabled, disabled] = boolSelector('_d.demo.disabled');
    const [Readonly, readonly] = boolSelector('_d.demo.readonly');
    const [Layout, layout] = layoutSelector('布局', 'horizontal');
    const [Rounded, rounded] = boolSelector('_d.demo.rounded', false);

    const prefix = <div class="bg-red-500 flex items-center">prefix</div>;
    const suffix = <div class="bg-red-500 flex items-center">suffix</div>;

    return <>
        <Portal mount={props.mount}>
            <Palette />
            <Readonly />
            <Rounded />
            <Disabled />
            <Layout />
            <Button palette="primary" onclick={() => {
                txt.setError(txt.getError() ? undefined : 'error');
            }}>toggle error</Button>
        </Portal>

        <div class="flex flex-col gap-2 w-80">
            <TextField hasHelp layout={layout()} placeholder='placeholder' palette={palette()}
                disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={txt} />
            <TextField hasHelp layout={layout()} placeholder='placeholder' label="label"
                palette={palette()} disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={txt} />
            <TextField hasHelp layout={layout()} placeholder='placeholder' label="prefix"
                prefix={<IconFace class='self-center' />} palette={palette()} disabled={disabled()}
                rounded={rounded()} readonly={readonly()} accessor={txt} />
            <TextField hasHelp layout={layout()} placeholder='placeholder' label="prefix+suffix"
                prefix={cloneElement(prefix)} suffix={cloneElement(suffix)} palette={palette()}
                disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={txt} />

            <TextField hasHelp layout={layout()} placeholder='placeholder' label="onsearch" class="w-100"
                prefix={cloneElement(prefix)} suffix={cloneElement(suffix)} palette={palette()}
                disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={txt}
                onSearch={v => {
                    if (!v) return [];
                    return ['abc@gmail.com', 'def@qq.com', 'ghi@126.com'].filter(item => item.includes(v));
                }}
            />
        </div>
    </>;
}
