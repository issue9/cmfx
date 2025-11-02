// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { fieldAccessor, Range, MountProps, Button } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector } from '../../base';

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

    return <>
        <Portal mount={props.mount}>
            {readonlyS}
            {disabledS}
            {layoutS}
            {fitHeightS}
            {valueS}
            {roundedS}
            <Button palette="primary" onclick={() => f.setError(f.getError() ? undefined : 'error')}>toggle error</Button>
        </Portal>

        <div>
            <Range hasHelp rounded={rounded()} value={value() ? formatValue : undefined} fitHeight={fitHeight()} accessor={f} palette='primary'
                step={0.5} min={0} max={100} disabled={disabled()} readonly={readonly()} layout={layout()} />
        </div>
    </>;
}
