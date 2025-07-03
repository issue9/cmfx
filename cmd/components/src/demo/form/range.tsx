// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { fieldAccessor, Range } from '@cmfx/components';
import { For } from 'solid-js';

import { boolSelector, Demo, layoutSelector, palettesWithUndefined, Stage } from '../base';

export default function () {
    const f = fieldAccessor('name', 5, true);

    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [layoutS, layout] = layoutSelector('布局', 'horizontal');
    const [fitHeightS, fitHeight] = boolSelector('fitHeight', false);

    return <Demo settings={
        <>
            {readonlyS}
            {disabledS}
            {layoutS}
            {fitHeightS}
            <button class="palette--primary" onClick={() => f.setError(f.getError() ? undefined : 'error')}>toggle error</button>
        </>
    }>
        <Stage title="palette">
            <For each={palettesWithUndefined}>
                {(item) => (
                    <Range fitHeight={fitHeight()} label={item ?? 'undefined'} accessor={f} palette={item} disabled={disabled()} readonly={readonly()} layout={layout()} />
                )}
            </For>
        </Stage>

        <Stage title="step">
            <Range fitHeight={fitHeight()} accessor={f} palette='primary' step={20} min={0} max={100} disabled={disabled()} readonly={readonly()} layout={layout()} />
        </Stage>

        <Stage title="float step">
            <Range fitHeight={fitHeight()} accessor={f} palette='primary' step={0.5} min={0} max={100} disabled={disabled()} readonly={readonly()} layout={layout()} />
        </Stage>

        <Stage title="mark">
            <Range fitHeight={fitHeight()} accessor={f} palette='primary' disabled={disabled()} readonly={readonly()} layout={layout()}
                step={10} min={0} max={100} marks={[[0, '0'], [30, '30'], [50, '50'], [80, '80'], [100, 'last']]}
            />
        </Stage>

        <Stage title="mark">
            <Range class="min-w-90" fitHeight={fitHeight()} accessor={f} palette='primary' disabled={disabled()} readonly={readonly()} layout={layout()}
                step={10} min={0} max={130} marks={[[0, '0'], [30, '30'], [50, '50'], [80, '80'], [130, 'last']]}
            />
        </Stage>
    </Demo>;
}
