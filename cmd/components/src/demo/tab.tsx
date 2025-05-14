// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Tab } from '@cmfx/components';
import { For } from 'solid-js';

import { boolSelector, Demo, palettesWithUndefined, Stage } from './base';

export default function() {
    const [disabledS, disabled] = boolSelector('disabled');
    const [roundedS, rounded] = boolSelector('rounded');

    const TabH = () => <div class="flex flex-wrap items-center gap-2">
        <For each={palettesWithUndefined}>
            {(c)=>(
                <>
                    <Tab rounded={rounded()} palette={c} disabled={disabled()} items={[['k1', 'K1'], ['k2', 'K2'], ['k3', 'K3']]} />
                    <br />
                </>
            )}
        </For>
    </div>;

    const TabV = () => <div class="flex flex-wrap items-center gap-2">
        <For each={palettesWithUndefined}>
            {(c)=>(
                <>
                    <Tab layout='vertical' rounded={rounded()} palette={c} disabled={disabled()} items={[['k1', 'K1'], ['k2', 'K2'], ['k3', 'K3']]} />
                    <br />
                </>
            )}
        </For>
    </div>;
    
    return <Demo settings={
        <>
            {disabledS}
            {roundedS}
        </>
    }>
        <Stage title="tab-h">
            <TabH />
        </Stage>

        <Stage title="tab-v">
            <TabV />
        </Stage>
    </Demo>;
}
