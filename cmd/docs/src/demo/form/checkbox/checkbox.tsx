// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Checkbox, MountProps } from '@cmfx/components';
import { createSignal, For } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, palettesWithUndefined } from '../../base';

export default function(props: MountProps) {
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [blockS, block] = boolSelector('block');
    const [roundedS, rounded] = boolSelector('rounded');

    const [chk, setChk] = createSignal<boolean>();
    const onchange = (v?: boolean): void => { setChk(v); };

    return <div>
        <Portal mount={props.mount}>
            {readonlyS}
            {disabledS}
            {blockS}
            {roundedS}
        </Portal>

        <div>
            <For each={palettesWithUndefined}>
                {(item) => (
                    <Checkbox rounded={rounded()} title={item ? item : 'undefined'} label='test'
                        block={block()} palette={item} disabled={disabled()} readonly={readonly()}
                    />
                )}
            </For>
        </div>

        <div>
            <Checkbox rounded={rounded()} indeterminate title='onchange' label='事件：onchange'
                onChange={onchange} block={block()} disabled={disabled()} readonly={readonly()} />
            <div>{chk() ? 'checked' : 'unchecked'}</div>
        </div>
    </div>;
}
