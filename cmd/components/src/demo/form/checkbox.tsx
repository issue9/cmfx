// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Checkbox, CheckboxGroup, fieldAccessor, FieldOptions } from '@cmfx/components';
import { createSignal, For } from 'solid-js';

import { boolSelector, Demo, layoutSelector, palettesWithUndefined, Stage } from '../base';

export default function() {
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [layoutS, layout] = layoutSelector('布局', 'horizontal');
    const [itemLayoutS, itemLayout] = layoutSelector('子项布局', 'horizontal');
    const [blockS, block] = boolSelector('block');

    const groupFA = fieldAccessor('checkbox', ['1'], true);
    const groupOptions: FieldOptions<string> = [
        ['1', <div>abc</div>],
        ['2', <div style="color:red">red</div >],
        ['3', <div style="color:red">red<br/>red<br/>red</div>],
    ];

    const [chk, setChk] = createSignal<boolean>();
    const onchange = (v?: boolean): void => { setChk(v); };

    const [i, setI] = createSignal<boolean>(true);

    return <Demo settings={
        <>
            {readonlyS}
            {disabledS}
            {layoutS}
            {itemLayoutS}
            {blockS}

            <button class="palette--primary" onClick={() => groupFA.setError(groupFA.getError() ? undefined : 'error')}>toggle error</button>
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
            <Checkbox indeterminate title='onchange' label='事件：onchange' onChange={onchange} block={block()} disabled={disabled()} readonly={readonly()} />
            <div>{ chk() ? 'checked' : 'unchecked' }</div>
        </Stage>

        <Stage title="checkbox Group">
            <CheckboxGroup help="help text" layout={layout()} itemLayout={itemLayout()}
                block={block()} disabled={disabled()} readonly={readonly()} label="group" palette="primary"
                options={groupOptions} accessor={groupFA}
            />
            <pre>{groupFA.getValue().toString()}</pre>
        </Stage>

        <Stage title="indeterminate">
            <Checkbox indeterminate={i()} title='indeterminate' label='indeterminate' block={block()} disabled={disabled()} readonly={readonly()} />
            <Button onclick={() => setI(!i())}>indeterminate - { i() ? 'true' : 'false' }</Button>
        </Stage>
    </Demo>;
}
