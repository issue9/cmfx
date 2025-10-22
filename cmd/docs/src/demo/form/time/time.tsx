// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { fieldAccessor, TimePicker } from '@cmfx/components';

import { boolSelector, layoutSelector, paletteSelector } from '../../base';

export default function() {
    const ac = fieldAccessor('time', new Date('2024-01-02T15:34'));

    const [paletteS, palette] = paletteSelector('primary');
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [roundedS, rounded] = boolSelector('rounded');
    const [layoutS, layout] = layoutSelector('布局', 'horizontal');

    return <div>
        {paletteS}
        {disabledS}
        {readonlyS}
        {roundedS}
        {layoutS}
        <button class="palette--primary" onClick={() => ac.setError(ac.getError() ? undefined : 'error')}>toggle error</button>

        <TimePicker hasHelp placeholder='placeholder' layout={layout()} label='label' palette={palette()} rounded={rounded()} readonly={readonly()} disabled={disabled()} accessor={ac} />
    </div>;
}
