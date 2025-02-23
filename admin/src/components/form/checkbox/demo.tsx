// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { For } from 'solid-js';

import { boolSelector, Demo, palettesWithUndefined } from '@/components/base/demo';
import { FieldAccessor, Options } from '@/components/form';
import { Checkbox } from './checkbox';
import { CheckboxGroup } from './group';

export default function() {
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [verticalS, vertical] = boolSelector('vertical');
    const [blockS, block] = boolSelector('block');

    const groupFA = FieldAccessor('checkbox', ['1'], true);
    const groupOptions: Options<string> = [
        ['1', <div>abc</div>],
        ['2', <div style="color:red">red</div >],
        ['3', <div style="color:red">red<br/>red<br/>red</div>],
    ];

    return <Demo settings={
        <>
            {readonlyS}
            {disabledS}
            {verticalS}
            {blockS}

            <button class="c--button c--button-fill palette--primary" onClick={() => groupFA.setError(groupFA.getError() ? undefined : 'error')}>toggle error</button>
        </>

    }>
        <div class="flex flex-wrap mb-10">
            <For each={palettesWithUndefined}>
                {(item) => (
                    <Checkbox 
                        title={item ? item : 'undefined'} label='test' block={block()} palette={item} disabled={disabled()} readonly={readonly()}
                    />
                )}
            </For>
        </div>

        <div class="flex flex-col mb-10">
            <CheckboxGroup
                block={block()} disabled={disabled()} vertical={vertical()} readonly={readonly()} label="group" palette="primary"
                options={groupOptions} accessor={groupFA}
            />
            <pre>{groupFA.getValue().toString()}</pre>
        </div>
    </Demo>;
}
