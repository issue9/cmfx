// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { fieldAccessor, Range } from '@cmfx/components';
import { For, JSX } from 'solid-js';

import { boolSelector, layoutSelector, palettesWithUndefined } from '../../base';

function formatValue(value: number): JSX.Element {
    return value.toFixed(2)+'%';
}

export default function () {
    const f = fieldAccessor('name', 5);

    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [layoutS, layout] = layoutSelector('布局', 'horizontal');
    const [fitHeightS, fitHeight] = boolSelector('fitHeight', false);
    const [valueS, value] = boolSelector('value', false);
    const [roundedS, rounded] = boolSelector('rounded', false);

    return <div>
        {readonlyS}
        {disabledS}
        {layoutS}
        {fitHeightS}
        {valueS}
        {roundedS}
        <button class="palette--primary" onClick={() => f.setError(f.getError() ? undefined : 'error')}>toggle error</button>

        <div>
            <For each={palettesWithUndefined}>
                {(item) => (
                    <Range rounded={rounded()} value={value() ? formatValue : undefined} fitHeight={fitHeight()} label={item ?? 'undefined'} accessor={f} palette={item} disabled={disabled()} readonly={readonly()} layout={layout()} />
                )}
            </For>
        </div>
    </div>;
}
