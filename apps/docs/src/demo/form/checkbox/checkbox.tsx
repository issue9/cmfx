// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Checkbox, MountProps } from '@cmfx/components';
import { createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector } from '../../base';

export default function(props: MountProps) {
    const [Disabled, disabled] = boolSelector('_d.demo.disabled');
    const [Readonly, readonly] = boolSelector('_d.demo.readonly');
    const [Block, block] = boolSelector('block');
    const [Rounded, rounded] = boolSelector('_d.demo.rounded');

    const [chk, setChk] = createSignal<boolean>();
    const onchange = (v?: boolean): void => { setChk(v); };

    return <div>
        <Portal mount={props.mount}>
            <Readonly />
            <Disabled />
            <Block />
            <Rounded />
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
