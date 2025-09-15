// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { FieldOptions, Tab } from '@cmfx/components';
import { For } from 'solid-js';

import { boolSelector, palettesWithUndefined } from '../base';

export default function() {
    const [disabledS, disabled] = boolSelector('disabled');
    const [roundedS, rounded] = boolSelector('rounded');
    const items: FieldOptions<string>
        = [['k1', 'K1'], ['k2', 'K2'], ['k3', 'K3'], ['k4', 'K4']];

    return <div>
        {disabledS}
        {roundedS}
        <For each={palettesWithUndefined}>
            {(c) => (
                <>
                    <Tab class="w-10" layout='vertical' rounded={rounded()} palette={c}
                        disabled={disabled()} items={structuredClone(items)} />
                    <br />
                </>
            )}
        </For>
    </div>;
}
