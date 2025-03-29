// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { For } from 'solid-js';

import { boolSelector, Stage, Demo, palettesWithUndefined } from '@/components/base/demo';
import { FieldAccessor } from '@/components/form/field';
import Range from './range';

export default function () {
    const f = FieldAccessor('name', 5, true);

    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [horizontalS, horizontal] = boolSelector('horizontal', true);
    const [fitHeightS, fitHeight] = boolSelector('fitHeight', false);

    return <Demo settings={
        <>
            {readonlyS}
            {disabledS}
            {horizontalS}
            {fitHeightS}
            <button class="c--button c--button-fill palette--primary" onClick={() => f.setError(f.getError() ? undefined : 'error')}>toggle error</button>
        </>
    }>
        <Stage title="palette">
            <For each={palettesWithUndefined}>
                {(item) => (
                    <Range fitHeight={fitHeight()} label={item ?? 'undefined'} accessor={f} palette={item} disabled={disabled()} readonly={readonly()} horizontal={horizontal()} />
                )}
            </For>
        </Stage>

        <Stage title="step">
            <Range fitHeight={fitHeight()} accessor={f} palette='primary' step={10} min={0} max={100} disabled={disabled()} readonly={readonly()} horizontal={horizontal()} />
        </Stage>
    </Demo>;
}