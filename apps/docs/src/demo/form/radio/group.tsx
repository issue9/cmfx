// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT


import { Button, fieldAccessor, FieldOptions, MountProps, Palette, RadioGroup } from '@cmfx/components';
import { createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector } from '../../base';

export default function(props: MountProps) {
    const [change, setChange] = createSignal<string>('');
    const f = fieldAccessor<Palette>('name', 'secondary');
    f.onChange((v, o) => setChange(`new: ${v}, old: ${o}`));
    const [Rounded, rounded] = boolSelector('_d.demo.rounded');
    const [Disabled, disabled] = boolSelector('_d.demo.disabled');
    const [Readonly, readonly] = boolSelector('_d.demo.readonly');
    const [Layout, layout] = layoutSelector('布局', 'horizontal');
    const [ItemLayout, itemLayout] = layoutSelector('子项布局', 'horizontal');
    const [Block, block] = boolSelector('block');

    const options: FieldOptions<Palette | 'undefined'> = [
        {value: 'error', label: 'error'},
        {value: 'secondary', label: 'secondary'},
        {value: 'undefined', label: 'undefined'},
        {value: 'surface', label: 'surface'},
    ];

    return <>
        <Portal mount={props.mount}>
            <Readonly />
            <Disabled />
            <Layout />
            <ItemLayout />
            <Block />
            <Rounded />
            <Button palette="primary" onclick={() => f.setError(f.getError() ? undefined : 'error')}>toggle error</Button>
        </Portal>

        <div>
            <RadioGroup hasHelp rounded={rounded()} label='test' block={block()}
                itemLayout={itemLayout()} layout={layout()} palette={f.getValue()}
                disabled={disabled()} readonly={readonly()} accessor={f} options={options}
            />
            <span>{change()}</span>
        </div>
    </>;
}
