// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT


import { MountProps, Radio } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector } from '@docs/components/base';

export default function(props: MountProps): JSX.Element {
    const [Rounded, rounded] = boolSelector('_d.demo.rounded');
    const [Disabled, disabled] = boolSelector('_d.demo.disabled');
    const [Readonly, readonly] = boolSelector('_d.demo.readonly');
    const [Block, block] = boolSelector('_d.demo.block');

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
