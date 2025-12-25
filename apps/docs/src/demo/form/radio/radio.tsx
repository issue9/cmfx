// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT


import { MountProps, Radio } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { boolSelector } from '../../base';

export default function(props: MountProps) {
    const [Rounded, rounded] = boolSelector('_d.demo.rounded');
    const [Disabled, disabled] = boolSelector('_d.demo.disabled');
    const [Readonly, readonly] = boolSelector('_d.demo.readonly');
    const [Block, block] = boolSelector('block');

    return <>
        <Portal mount={props.mount}>
            <Readonly />
            <Disabled />
            <Rounded />
            <Block />
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
