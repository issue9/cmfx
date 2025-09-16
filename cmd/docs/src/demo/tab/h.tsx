// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { FieldOptions, Tab } from '@cmfx/components';
import { For } from 'solid-js';

import { palettesWithUndefined } from '../base';

export default function() {
    const items: FieldOptions<string>
        = [['k1', 'K1'], ['k2', 'K2'], ['k3', 'K3'], ['k4', 'K4']];

    return <div>
        <For each={palettesWithUndefined}>
            {(c) => (
                <>
                    <Tab palette={c} items={structuredClone(items)} />
                    <br />
                </>
            )}
        </For>
    </div>;
}
