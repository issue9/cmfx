// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { modes, SchemeBuilder, use } from '@cmfx/components';
import { createEffect } from 'solid-js';

import { arraySelector, Demo, paletteSelector } from '../base';

export default function () {
    const [paletteS, palette] = paletteSelector();
    const [modeS, mode] = arraySelector('mode', modes, 'system');
    const [, act] = use();

    createEffect(() => {
        act.switchMode(mode());
    });

    return <Demo settings={<>
        {paletteS}
        {modeS}
    </>}>
        <SchemeBuilder palette={palette()} />
    </Demo>;
}
