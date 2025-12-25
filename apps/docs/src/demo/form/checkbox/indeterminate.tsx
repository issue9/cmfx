// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Checkbox, MountProps } from '@cmfx/components';
import { createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector } from '../../base';

export default function(props: MountProps) {
    const [Disabled, disabled] = boolSelector('_d.demo.disabled');
    const [Readonly, readonly] = boolSelector('_d.demo.readonly');
    const [Block, block] = boolSelector('block');
    const [Rounded, rounded] = boolSelector('_d.demo.rounded');

    const [i, setI] = createSignal<boolean>(true);

    return <div>
        <Portal mount={props.mount}>
            <Readonly />
            <Disabled />
            <Block />
            <Rounded />
        </Portal>

        <Checkbox indeterminate={i()} title='indeterminate' rounded={rounded()}
            label='indeterminate' block={block()} disabled={disabled()} readonly={readonly()} />
        <Button onclick={() => setI(!i())}>indeterminate - {i() ? 'true' : 'false'}</Button>
    </div>;
}
