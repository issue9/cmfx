// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Checkbox, MountProps } from '@cmfx/components';
import { createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector } from '../../base';

export default function(props: MountProps) {
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [blockS, block] = boolSelector('block');
    const [roundedS, rounded] = boolSelector('rounded');

    const [i, setI] = createSignal<boolean>(true);

    return <div>
        <Portal mount={props.mount}>
            {readonlyS}
            {disabledS}
            {blockS}
            {roundedS}
        </Portal>

        <Checkbox indeterminate={i()} title='indeterminate' rounded={rounded()}
            label='indeterminate' block={block()} disabled={disabled()} readonly={readonly()} />
        <Button onclick={() => setI(!i())}>indeterminate - {i() ? 'true' : 'false'}</Button>
    </div>;
}
