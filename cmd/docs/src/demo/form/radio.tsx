// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT


import { fieldAccessor, FieldOptions, Palette, Radio, RadioGroup } from '@cmfx/components';
import { createSignal } from 'solid-js';

import { boolSelector, Demo, layoutSelector, palettesWithUndefined, Stage } from '../base';

export default function() {
    const [change, setChange] = createSignal<string>('');
    const f = fieldAccessor<Palette>('name', 'secondary');
    f.onChange((v, o) => setChange(`new: ${v}, old: ${o}`));
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [layoutS, layout] = layoutSelector('布局', 'horizontal');
    const [itemLayoutS, itemLayout] = layoutSelector('子项布局', 'horizontal');
    const [blockS, block] = boolSelector('block');
    const [roundedS, rounded] = boolSelector('rounded');

    const options: FieldOptions<Palette | 'undefined'> = [];
    palettesWithUndefined.forEach((item) => {
        options.push([item ?? 'undefined', item ? item : 'undefined']);
    });

    return <Demo settings={
        <>
            {readonlyS}
            {disabledS}
            {layoutS}
            {itemLayoutS}
            {blockS}
            {roundedS}

            <button class=" palette--primary" onClick={() => f.setError(f.getError() ? undefined : 'error')}>toggle error</button>
        </>
    }>
        <Stage title="radio">
            <input type="radio" name="radio1" value="option1" readonly={readonly()} disabled={disabled()} />
            <input type="radio" name="radio1" value="option2" readonly={readonly()} disabled={disabled()} />
            <Radio name="radio1" label="Radio" block={block()} rounded={rounded()} value="option3" readonly={readonly()} disabled={disabled()} />
        </Stage>
        <Stage title="radio group">
            <RadioGroup hasHelp rounded={rounded()} label='test' block={block()} itemLayout={itemLayout()} layout={layout()} palette={f.getValue()}
                disabled={disabled()} readonly={readonly()} accessor={f} options={options}
            />
            <span>{change()}</span>
        </Stage>
    </Demo>;
}
