// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { fieldAccessor, TimePicker, MountProps, Button } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector, paletteSelector } from '../../base';

export default function(props: MountProps) {
    const ac = fieldAccessor('time', new Date('2024-01-02T15:34'));

    const [paletteS, palette] = paletteSelector('primary');
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [roundedS, rounded] = boolSelector('rounded');
    const [layoutS, layout] = layoutSelector('布局', 'horizontal');

    return <div>
        <Portal mount={props.mount}>
            {paletteS}
            {disabledS}
            {readonlyS}
            {roundedS}
            {layoutS}
            <Button palette="primary" onclick={() => ac.setError(ac.getError() ? undefined : 'error')}>toggle error</Button>
        </Portal>

        <TimePicker hasHelp placeholder='placeholder' layout={layout()} label='label' palette={palette()} rounded={rounded()} readonly={readonly()} disabled={disabled()} accessor={ac} />
    </div>;
}
