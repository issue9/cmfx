// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Checkbox, MountProps } from '@cmfx/components';
import { createSignal, JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector } from '@docs/components/base';

export default function(props: MountProps): JSX.Element {
    const [Disabled, disabled] = boolSelector('_d.demo.disabled');
    const [Readonly, readonly] = boolSelector('_d.demo.readonly');
    const [Block, block] = boolSelector('_d.demo.block');
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
