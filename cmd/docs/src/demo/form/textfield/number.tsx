// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { fieldAccessor, Number } from '@cmfx/components';
import IconFace from '~icons/material-symbols/face';

import { boolSelector, layoutSelector, paletteSelector } from '../../base';

export default function() {
    const txt = fieldAccessor('name', 'text');
    const num = fieldAccessor('name', 5);

    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [roundedS, rounded] = boolSelector('rounded');
    const [layoutS, layout] = layoutSelector('布局', 'horizontal');
    const [paletteS, palette] = paletteSelector();

    return <div>
        {paletteS}
        {readonlyS}
        {roundedS}
        {disabledS}
        {layoutS}
        <button class="palette--primary" onClick={() => {
            num.setError(num.getError() ? undefined : 'error');
        }}>toggle error</button>

        <div class="flex flex-col gap-2 w-80">
            <Number hasHelp layout={layout()} placeholder='placeholder' palette={palette()}
                disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={num} />
            <Number hasHelp layout={layout()} placeholder='placeholder' label="icon"
                prefix={<IconFace class='self-center' />} palette={palette()} disabled={disabled()}
                rounded={rounded()} readonly={readonly()} accessor={num} />
            <Number hasHelp layout={layout()} placeholder='placeholder' label="range:[1,10]"
                prefix={<IconFace class='self-center' />} min={1} max={10} palette={palette()}
                disabled={disabled()} rounded={rounded()} readonly={readonly()} accessor={num} />
        </div>
    </div>;
}
