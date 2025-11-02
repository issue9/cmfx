// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT


import { fieldAccessor, FieldOptions, Palette, RadioGroup, MountProps, Button } from '@cmfx/components';
import { createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector } from '../../base';

export default function(props: MountProps) {
    const [change, setChange] = createSignal<string>('');
    const f = fieldAccessor<Palette>('name', 'secondary');
    f.onChange((v, o) => setChange(`new: ${v}, old: ${o}`));
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [layoutS, layout] = layoutSelector('布局', 'horizontal');
    const [itemLayoutS, itemLayout] = layoutSelector('子项布局', 'horizontal');
    const [blockS, block] = boolSelector('block');
    const [roundedS, rounded] = boolSelector('rounded');

    const options: FieldOptions<Palette | 'undefined'> = [
        {value: 'error', label: 'error'},
        {value: 'secondary', label: 'secondary'},
        {value: 'undefined', label: 'undefined'},
        {value: 'surface', label: 'surface'},
    ];

    return <>
        <Portal mount={props.mount}>
            {readonlyS}
            {disabledS}
            {layoutS}
            {itemLayoutS}
            {blockS}
            {roundedS}
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
