// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { For } from 'solid-js';

import { boolSelector, Demo, palettesWithUndefined } from '@/components/base/demo';
import { FieldAccessor } from '@/components/form';
import { TextArea } from './textarea';

export default function() {
    const f = FieldAccessor('name', '5', true);
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');

    return <Demo settings={
        <>
            {readonlyS}
            {disabledS}
            <button class="c--button c--button-fill palette--primary" onClick={() => f.setError(f.getError() ? undefined : 'error')}>toggle error</button>
        </>
    }>
        <For each={palettesWithUndefined}>
            {(item) => (
                <TextArea palette={item} title={item?item:'undefined'} disabled={disabled()} readonly={readonly()} accessor={f} />
            )}
        </For>
    </Demo>;
}
