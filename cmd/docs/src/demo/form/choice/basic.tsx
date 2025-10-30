// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Choice, ChoiceOption, fieldAccessor, TextField, MountProps } from '@cmfx/components';
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

    const [paletteS, palette] = paletteSelector();
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [roundedS, rounded] = boolSelector('rounded');
    const [layoutS, layout] = layoutSelector('布局', 'horizontal');

    return <div>
        <Portal mount={props.mount}>
            {paletteS}
            {disabledS}
            {readonlyS}
            {roundedS}
            {layoutS}

            <button class="palette--primary" onClick={() => {
                fa.setError(fa.getError() ? undefined : 'error');
            }}>toggle error</button>
        </Portal>

        <div class="flex flex-row gap-5">
            <Choice hasHelp layout={layout()} tabindex={0} placeholder='placeholder' disabled={disabled()} rounded={rounded()} readonly={readonly()} palette={palette()} label="label+tabindex" accessor={fa} options={options} />
            <TextField layout={layout()} placeholder='placeholder' disabled={disabled()} rounded={rounded()} readonly={readonly()} palette={palette()} accessor={tf} />
        </div>
    </div>;
}
