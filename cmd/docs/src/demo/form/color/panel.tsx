// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { fieldAccessor, OKLCHPanel } from '@cmfx/components';

import { boolSelector, paletteSelector } from '../../base';

export default function() {
    const [paletteS, palette] = paletteSelector();
    const [readonlyS, readonly] = boolSelector('readonly');
    const [disabledS, disabled] = boolSelector('disabled');

    const color = fieldAccessor('color', 'oklch(1% 0.3 100)');

    return <div>
        {paletteS}
        {readonlyS}
        {disabledS}
        <OKLCHPanel readonly={readonly()} disabled={disabled()} palette={palette()} accessor={color} />
    </div>;
}
