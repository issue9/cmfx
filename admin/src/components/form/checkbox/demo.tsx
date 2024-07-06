// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT


import { createSignal, For, JSX } from 'solid-js';

import { colors } from '@/components/base';
import { FieldAccessor } from '@/components/form';
import { XCheckboxGroup } from '.';
import XCheckbox from './checkbox';

export default function() {
    const [disable, setDisable] = createSignal(false);
    const [readonly, setReadonly] = createSignal(false);
    const [vertical, setVertical] = createSignal(false);
    const [icon, setIcon] = createSignal(true);

    const checkboxOptions: Array<[string,string]> = [];
    colors.forEach((item) => {
        checkboxOptions.push([item, item]);
    });

    const groupFA = FieldAccessor('checkbox', ['1']);
    const groupOptions: Array<[string, JSX.Element]> = [
        ['1', <div>abc</div>],
        ['2', <div style="color:red">red</div >],
        ['3', <div style="color:red">red<br/>red<br/>red</div >],
    ];

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

            <button class="button filled scheme--primary" onClick={() => groupFA.setError(groupFA.getError() ? undefined : 'error')}>toggle error</button>
        </fieldset>

        <For each={colors}>
            {(item)=>(
                <XCheckbox label='test' icon={icon()} color={item} disabled={disable()} readonly={readonly()} />
            )}
        </For>

        <p class="my-4">group</p>

        <XCheckboxGroup icon={icon()} disabled={disable()} vertical={vertical()} readonly={readonly()} label="group" color="primary" options={groupOptions} accessor={groupFA} />
        <pre>{ groupFA.getValue().toString() }</pre>
    </div>;
}
