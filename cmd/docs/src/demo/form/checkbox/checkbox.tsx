// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Checkbox, MountProps } from '@cmfx/components';
import { createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector } from '../../base';

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

        <div class="flex flex-col justify-start">
            <Checkbox rounded={rounded()} title='primary' label='primary'
                block={block()} palette='primary' disabled={disabled()} readonly={readonly()}
            />

            <Checkbox rounded={rounded()} title='error' label='error'
                block={block()} palette='error' disabled={disabled()} readonly={readonly()}
            />

            <Checkbox rounded={rounded()} indeterminate title='onchange' label='事件：onchange'
                onChange={onchange} block={block()} disabled={disabled()} readonly={readonly()} />

            <div>{chk() ? 'checked' : 'unchecked'}</div>
        </div>
    </div>;
}
