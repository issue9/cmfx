// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, cloneElement, fieldAccessor, MountProps, TextField } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconFace from '~icons/material-symbols/face';

import { boolSelector, layoutSelector, paletteSelector } from '@docs/components/base';

export default function(props: MountProps): JSX.Element {
    const txt = fieldAccessor('name', 'text');

    const [Palette, palette] = paletteSelector();
    const [Disabled, disabled] = boolSelector('_d.demo.disabled');
    const [Readonly, readonly] = boolSelector('_d.demo.readonly');
    const [Layout, layout] = layoutSelector('_d.demo.componentLayout', 'horizontal');
    const [Rounded, rounded] = boolSelector('_d.demo.rounded', false);
    const [Count, count] = boolSelector('_d.demo.charCount', false);

    const prefix = <div class="bg-red-500 flex items-center">prefix</div>;
    const suffix = <div class="bg-red-500 flex items-center">suffix</div>;

    return <>
        <Portal mount={props.mount}>
            <Palette />
            <Readonly />
            <Rounded />
            <Disabled />
            <Layout />
            <Count />
            <Button palette="primary" onclick={() => {
                txt.setError(txt.getError() ? undefined : 'error');
            }}>toggle error</Button>
        </Portal>

        <div class="flex flex-col gap-2 w-80">
            <TextField count={count() ? (v, m) => `${v}-${m}` : undefined} hasHelp
                layout={layout()} placeholder='placeholder' palette={palette()}
                disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={txt} />
            <TextField count={count()} hasHelp layout={layout()} placeholder='placeholder' label="label"
                palette={palette()} disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={txt} />
            <TextField count={count()} hasHelp layout={layout()} placeholder='placeholder' label="prefix"
                prefix={<IconFace class='self-center' />} palette={palette()} disabled={disabled()}
                rounded={rounded()} readonly={readonly()} accessor={txt} />
            <TextField count={count()} hasHelp layout={layout()} placeholder='placeholder' label="prefix+suffix"
                prefix={cloneElement(prefix)} suffix={cloneElement(suffix)} palette={palette()}
                disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={txt} />

            <TextField count={count()} hasHelp layout={layout()} placeholder='placeholder' label="onsearch" class="w-100"
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
