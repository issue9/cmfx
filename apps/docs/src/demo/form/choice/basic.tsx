// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Choice, ChoiceOption, fieldAccessor, MountProps, TextField } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector, paletteSelector } from '../../base';

export default function(props: MountProps) {
    const fa = fieldAccessor<string|undefined>('choice', '1');
    const options: Array<ChoiceOption> = [
        { type: 'item', value: '1', label: <div>abc</div> },
        { type: 'item', value: '2', label: <div style="color:green">green</div > },
        { type: 'item', value: '3', label: <div style="color:red">red<br />red</div> },
    ];

    const tf = fieldAccessor('textfield', '');

    const [Palette, palette] = paletteSelector();
    const [Closable, closable] = boolSelector('closable');
    const [Layout, layout] = layoutSelector('_d.demo.componentLayout', 'horizontal');
    const [Disabled, disabled] = boolSelector('_d.demo.disabled');
    const [Readonly, readonly] = boolSelector('_d.demo.readonly');
    const [Rounded, rounded] = boolSelector('_d.demo.rounded');

    return <div>
        <Portal mount={props.mount}>
            <Palette />
            <Disabled />
            <Readonly />
            <Closable />
            <Rounded />
            <Layout />

            <Button palette="primary" onclick={() => {
                fa.setError(fa.getError() ? undefined : 'error');
            }}>toggle error</Button>
        </Portal>

        <div class="flex gap-5 justify-start items-start">
            <Choice closable={closable()} hasHelp layout={layout()} tabindex={0} placeholder='placeholder'
                disabled={disabled()} rounded={rounded()} readonly={readonly()} palette={palette()}
                label="label+tabindex" accessor={fa} options={options} />
            <TextField layout={layout()} placeholder='placeholder' disabled={disabled()}
                rounded={rounded()} readonly={readonly()} palette={palette()} accessor={tf} />
        </div>
    </div>;
}
