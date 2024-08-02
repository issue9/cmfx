// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT


import { createSignal, For } from 'solid-js';

import { boolSelector, colorsWithUndefined } from '@/components/base/demo';
import { FieldAccessor, Options } from '@/components/form';
import Checkbox from './checkbox';
import { default as CheckboxGroup } from './group';

export default function() {
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [verticalS, vertical] = boolSelector('vertical');
    const [iconS, icon] = boolSelector('icon', true);
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
            {readonlyS}
            {disabledS}
            {verticalS}
            {iconS}
            <br />

            <button class="c--button button-style--fill palette--primary" onClick={() => groupFA.setError(groupFA.getError() ? undefined : 'error')}>toggle error</button>
            <button class="c--button button-style--fill palette--primary" onClick={() => setIconStyle(!iconStyle())}>toggle icon</button>
        </fieldset>

        <div class="flex flex-wrap mb-10">
            <For each={colorsWithUndefined}>
                {(item)=>(
                    <Checkbox checkedIcon={iconStyle() ? 'verified': undefined}
                        title={item ? item : 'undefined'} label='test' icon={icon()} palette={item} disabled={disabled()} readonly={readonly()}
                    />
                )}
            </For>
        </div>

        <CheckboxGroup checkedIcon={iconStyle() ? 'verified': undefined}
            icon={icon()} disabled={disabled()} vertical={vertical()} readonly={readonly()} label="group" palette="primary"
            options={groupOptions} accessor={groupFA}
        />
        <pre>{ groupFA.getValue().toString() }</pre>
    </div>;
}
