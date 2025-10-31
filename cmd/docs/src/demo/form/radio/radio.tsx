// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT


import { Radio, MountProps } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { boolSelector } from '../../base';

export default function(props: MountProps) {
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [blockS, block] = boolSelector('block');
    const [roundedS, rounded] = boolSelector('rounded');

    return <>
        <Portal mount={props.mount}>
            {readonlyS}
            {disabledS}
            {blockS}
            {roundedS}
        </Portal>

        <div>
            <input type="radio" name="radio1" value="option1" tabindex={0}
                readonly={readonly()} disabled={disabled()} />
            <input type="radio" name="radio1" value="option2" tabindex={0}
                readonly={readonly()} disabled={disabled()} />
            <Radio name="radio1" label="Radio" block={block()} tabindex={0}
                rounded={rounded()} value="option3" readonly={readonly()} disabled={disabled()} />
        </div>
    </>;
}
