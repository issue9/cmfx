// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT


import { createSignal, For } from 'solid-js';

import { colorsWithUndefined } from '@/components/base/demo';
import { FieldAccessor, Options } from '@/components/form';
import Checkbox from './checkbox';
import { default as CheckboxGroup } from './group';

export default function() {
    const [disable, setDisable] = createSignal(false);
    const [readonly, setReadonly] = createSignal(false);
    const [vertical, setVertical] = createSignal(false);
    const [icon, setIcon] = createSignal(true);
    const [iconStyle, setIconStyle] = createSignal(false);

    const groupFA = FieldAccessor('checkbox', ['1'], true);
    const groupOptions: Options<string> = [
        ['1', <div>abc</div>],
        ['2', <div style="color:red">red</div >],
        ['3', <div style="color:red">red<br/>red<br/>red</div>],
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

            <button class="button filled palette--primary" onClick={() => groupFA.setError(groupFA.getError() ? undefined : 'error')}>toggle error</button>
            <button class="button filled palette--primary" onClick={() => setIconStyle(!iconStyle())}>toggle icon</button>
        </fieldset>

        <div class="flex flex-wrap mb-10">
            <For each={colorsWithUndefined}>
                {(item)=>(
                    <Checkbox checkedIcon={iconStyle() ? 'verified': undefined}
                        title={item ? item : 'undefined'} label='test' icon={icon()} palette={item} disabled={disable()} readonly={readonly()}
                    />
                )}
            </For>
        </div>

        <CheckboxGroup checkedIcon={iconStyle() ? 'verified': undefined}
            icon={icon()} disabled={disable()} vertical={vertical()} readonly={readonly()} label="group" palette="primary"
            options={groupOptions} accessor={groupFA}
        />
        <pre>{ groupFA.getValue().toString() }</pre>
    </div>;
}
