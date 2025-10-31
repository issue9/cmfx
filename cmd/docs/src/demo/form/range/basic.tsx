// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { fieldAccessor, Range, MountProps, Button } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector, paletteSelector } from '../../base';

function formatValue(value: number): JSX.Element {
    return value.toFixed(2)+'%';
}

export default function (props: MountProps) {
    const f = fieldAccessor('name', 5);

    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [layoutS, layout] = layoutSelector('布局', 'horizontal');
    const [fitHeightS, fitHeight] = boolSelector('fitHeight', false);
    const [valueS, value] = boolSelector('value', false);
    const [roundedS, rounded] = boolSelector('rounded', false);
    const [paletteS, palette] = paletteSelector();

    return <>
        <Portal mount={props.mount}>
            {paletteS}
            {readonlyS}
            {disabledS}
            {layoutS}
            {fitHeightS}
            {valueS}
            {roundedS}
            <Button palette='primary' onclick={() => f.setError(f.getError() ? undefined : 'error')}>toggle error</Button>
        </Portal>

        <div>
            <Range rounded={rounded()} value={value() ? formatValue : undefined} fitHeight={fitHeight()} label='label'
                accessor={f} palette='primary' disabled={disabled()} readonly={readonly()} layout={layout()} />

            <Range rounded={rounded()} value={value() ? formatValue : undefined} fitHeight={fitHeight()} label='label'
                accessor={f} palette={palette()} disabled={disabled()} readonly={readonly()} layout={layout()} />
        </div>
    </>;
}
