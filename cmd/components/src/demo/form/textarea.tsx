// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { fieldAccessor, TextArea } from '@cmfx/components';
import { For } from 'solid-js';

import { boolSelector, Demo, layoutSelector, palettesWithUndefined } from '../base';

export default function() {
    const f = fieldAccessor('name', '5', true);
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [layoutS, layout] = layoutSelector('布局', 'horizontal');

    return <Demo settings={
        <>
            {readonlyS}
            {disabledS}
            {layoutS}
            <button class="palette--primary" onClick={() => f.setError(f.getError() ? undefined : 'error')}>toggle error</button>
        </>
    }>
        <For each={palettesWithUndefined}>
            {(item) => (
                <TextArea layout={layout()} palette={item} label={item ? item : 'undefined'} title={item ? item : 'undefined'} disabled={disabled()} readonly={readonly()} accessor={f} />
            )}
        </For>
    </Demo>;
}
