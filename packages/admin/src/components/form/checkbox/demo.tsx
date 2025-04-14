// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, For } from 'solid-js';

import { boolSelector, Demo, palettesWithUndefined, Stage } from '@admin/components/base/demo';
import { FieldAccessor, Options } from '@admin/components/form/field';
import { Checkbox } from './checkbox';
import { CheckboxGroup } from './group';

export default function() {
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [horizontalS, horizontal] = boolSelector('horizontal', true);
    const [itemHorizontalS, itemHorizontal] = boolSelector('item-horizontal', true);
    const [blockS, block] = boolSelector('block');

    const groupFA = FieldAccessor('checkbox', ['1'], true);
    const groupOptions: Options<string> = [
        ['1', <div>abc</div>],
        ['2', <div style="color:red">red</div >],
        ['3', <div style="color:red">red<br/>red<br/>red</div>],
    ];
    
    const [chk, setChk] = createSignal<boolean>();
    const onchange = (v?: boolean): void => { setChk(v); };

    return <Demo settings={
        <>
            {readonlyS}
            {disabledS}
            {horizontalS}
            {itemHorizontalS}
            {blockS}

            <button class="c--button c--button-fill palette--primary" onClick={() => groupFA.setError(groupFA.getError() ? undefined : 'error')}>toggle error</button>
        </>

    }>
        <Stage title="checkbox">
            <For each={palettesWithUndefined}>
                {(item) => (
                    <Checkbox
                        title={item ? item : 'undefined'} label='test' block={block()} palette={item} disabled={disabled()} readonly={readonly()}
                    />
                )}
            </For>
        </Stage>
        
        <Stage title="change">
            <Checkbox title='onchange' label='onchange' onChange={onchange} block={block()} disabled={disabled()} readonly={readonly()} />
            <div>{ chk() ? 'checked' : 'unchecked' }</div>
        </Stage>

        <Stage title="checkbox Group">
            <CheckboxGroup help="help text" horizontal={horizontal()} itemHorizontal={itemHorizontal()}
                block={block()} disabled={disabled()} readonly={readonly()} label="group" palette="primary"
                options={groupOptions} accessor={groupFA}
            />
            <pre>{groupFA.getValue().toString()}</pre>
        </Stage>
    </Demo>;
}
