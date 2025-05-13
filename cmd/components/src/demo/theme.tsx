// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, DatePanel, FieldAccessor, palettes, SchemeBuilder } from '@cmfx/components';
import { For } from 'solid-js';

import { boolSelector, Demo } from './base';

export default function () {
    const [actionsS, actions] = boolSelector('actions', true);
    const dateFA = FieldAccessor('date', '2025-01-02');

    return <Demo settings={<>
        {actionsS}
    </>}>
        <SchemeBuilder actions={actions()}>
            <div class="flex gap-4 items-start">
                <DatePanel time accessor={dateFA} />
                <div class="flex flex-wrap gap-4">
                    <For each={palettes}>
                        {(p)=>(<Button palette={p}>button</Button>)}
                    </For>
                </div>
            </div>
        </SchemeBuilder>
    </Demo>;
}