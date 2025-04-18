// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT


import { createSignal } from 'solid-js';

import { Palette } from '@admin/components/base';
import { boolSelector, Demo, palettesWithUndefined, Stage } from '@admin/components/base/demo';
import { FieldAccessor, Options } from '@admin/components/form/field';
import { RadioGroup } from './group';

export default function() {
    const [change, setChange] = createSignal<string>('');
    const f = FieldAccessor<Palette>('name', 'primary', true);
    f.onChange((v,o)=>setChange(`new: ${v}, old: ${o}`));
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [horizontalS, horizontal] = boolSelector('horizontal');
    const [itemHorizontalS, itemHorizontal] = boolSelector('item-horizontal');
    const [blockS, block] = boolSelector('block');

    const options: Options<Palette|undefined> = [];
    palettesWithUndefined.forEach((item) => {
        options.push([item, item ? item : 'undefined']);
    });

    return <Demo settings={
        <>
            {readonlyS}
            {disabledS}
            {horizontalS}
            {itemHorizontalS}
            {blockS}

            <button class="c--button c--button-fill palette--primary" onClick={() => f.setError(f.getError() ? undefined : 'error')}>toggle error</button>
        </>
    }>
        <Stage title="radio group">
            <RadioGroup label='test' block={block()} itemHorizontal={itemHorizontal()} horizontal={horizontal()} palette={f.getValue()}
                disabled={disabled()} readonly={readonly()} accessor={f} options={options}
            />
            <span>{change()}</span>
        </Stage>
    </Demo>;
}
