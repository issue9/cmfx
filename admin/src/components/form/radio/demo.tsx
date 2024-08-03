// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT


import { createSignal } from 'solid-js';

import { Palette } from '@/components/base';
import { boolSelector, colorsWithUndefined, Demo } from '@/components/base/demo';
import { FieldAccessor, Options } from '@/components/form';
import { default as XGroup } from './radio';

export default function() {
    const [change, setChange] = createSignal<string>('');
    const f = FieldAccessor<Palette>('name', 'primary', true);
    f.onChange((v,o)=>setChange(`new: ${v}, old: ${o}`));
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [verticalS, vertical] = boolSelector('vertical');
    const [iconS, icon] = boolSelector('icon');
    const [iconStyle, setIconStyle] = createSignal(false);

    const options: Options<Palette|undefined> = [];
    colorsWithUndefined.forEach((item) => {
        options.push([item, item ? item : 'undefined']);
    });

    return <Demo settings={
        <>
            {readonlyS}
            {disabledS}
            {verticalS}
            {iconS}

            <button class="c--button c--button-fill palette--primary" onClick={() => f.setError(f.getError() ? undefined : 'error')}>toggle error</button>
            <button class="c--button c--button-fill palette--primary" onClick={() => setIconStyle(!iconStyle())}>toggle icon</button>
        </>
    } stages={
        <>
            <XGroup label='test' icon={icon()} vertical={vertical()} palette={f.getValue()}
                disabled={disabled()} readonly={readonly()} accessor={f} options={options}
                checkedIcon={iconStyle() ? 'task_alt' : undefined }
            />

            <span>{change()}</span>
        </>
    } />;
}
