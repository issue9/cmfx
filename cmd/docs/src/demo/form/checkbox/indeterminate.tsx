// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Checkbox } from '@cmfx/components';
import { createSignal } from 'solid-js';

import { boolSelector } from '../../base';

export default function() {
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [blockS, block] = boolSelector('block');
    const [roundedS, rounded] = boolSelector('rounded');

    const [i, setI] = createSignal<boolean>(true);

    return <div>
        {readonlyS}
        {disabledS}
        {blockS}
        {roundedS}
        <Checkbox indeterminate={i()} title='indeterminate' rounded={rounded()}
            label='indeterminate' block={block()} disabled={disabled()} readonly={readonly()} />
        <Button onclick={() => setI(!i())}>indeterminate - {i() ? 'true' : 'false'}</Button>
    </div>;
}
