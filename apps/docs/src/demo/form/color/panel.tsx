// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { fieldAccessor, OKLCHPanel, MountProps } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { boolSelector, paletteSelector } from '../../base';

export default function(props: MountProps) {
    const [paletteS, palette] = paletteSelector();
    const [readonlyS, readonly] = boolSelector('readonly');
    const [disabledS, disabled] = boolSelector('disabled');

    const color = fieldAccessor('color', 'oklch(1% 0.3 100)');

    return <div>
        <Portal mount={props.mount}>
            {paletteS}
            {readonlyS}
            {disabledS}
        </Portal>

        <OKLCHPanel readonly={readonly()} disabled={disabled()} palette={palette()} accessor={color} />
    </div>;
}
