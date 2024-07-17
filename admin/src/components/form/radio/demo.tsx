// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT


import { createSignal } from 'solid-js';

import { Scheme } from '@/components/base';
import { colorsWithUndefined } from '@/components/base/demo';
import { FieldAccessor, Options } from '@/components/form';
import { default as XGroup } from './radio';

export default function() {
    const [change, setChange] = createSignal<string>('');
    const f = FieldAccessor<Scheme>('name', 'primary', true);
    f.onChange((v,o)=>setChange(`new: ${v}, old: ${o}`));
    const [disable, setDisable] = createSignal(false);
    const [readonly, setReadonly] = createSignal(false);
    const [vertical, setVertical] = createSignal(false);
    const [icon, setIcon] = createSignal(true);
    const [iconStyle, setIconStyle] = createSignal(false);

    const options: Options<Scheme|undefined> = [];
    colorsWithUndefined.forEach((item) => {
        options.push([item, item ? item : 'undefined']);
    });


    return <div class="w-80">
        <fieldset class="border-2 my-4 box-border">
            <legend>设置</legend>

            <label class="mr-4">
                <input type="checkbox" checked={readonly()} onChange={(e) => setReadonly(e.target.checked)} />readonly
            </label>

            <label class="mr-4">
                <input type="checkbox" checked={disable()} onChange={(e) => setDisable(e.target.checked)} />disabled
            </label>

            <label class="mr-4">
                <input type="checkbox" checked={vertical()} onChange={(e) => setVertical(e.target.checked)} />vertical
            </label>

            <label class="mr-4">
                <input type="checkbox" checked={icon()} onChange={(e) => setIcon(e.target.checked)} />icon
            </label>

            <br />

            <button class="button filled scheme--primary" onClick={() => f.setError(f.getError() ? undefined : 'error')}>toggle error</button>
            <button class="button filled scheme--primary" onClick={() => setIconStyle(!iconStyle())}>toggle icon</button>
        </fieldset>

        <XGroup label='test' icon={icon()} vertical={vertical()} scheme={f.getValue()}
            disabled={disable()} readonly={readonly()} accessor={f} options={options}
            checkedIcon={iconStyle() ? 'task_alt' : undefined }
        />

        <span>{change()}</span>
    </div>;
}
