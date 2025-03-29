// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { For } from 'solid-js';

import { boolSelector, Demo, palettesWithUndefined } from '@/components/base/demo';
import { FieldAccessor } from '@/components/form/field';
import Range from './range';

export default function () {
    const f = FieldAccessor('name', 5, true);

    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [horizontalS, horizontal] = boolSelector('horizontal', true);

    return <Demo settings={
        <>
            {readonlyS}
            {disabledS}
            {horizontalS}
            <button class="c--button c--button-fill palette--primary" onClick={() => f.setError(f.getError() ? undefined : 'error')}>toggle error</button>
        </>
    }>
        <For each={palettesWithUndefined}>
            {(item) => (
                <Range label={item ?? 'undefined'} accessor={f} palette={item} disabled={disabled()} readonly={readonly()} horizontal={horizontal()} />
            )}
        </For>
    </Demo>;
}