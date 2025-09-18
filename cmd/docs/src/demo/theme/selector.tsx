// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Scheme, schemes, SchemeSelector } from '@cmfx/components';

import { Demo, paletteSelector, Stage } from '../base';

export default function() {
    const [paletteS, palette] = paletteSelector();
    const s = new Map<string, Scheme>([
        ['Green', schemes.green],
        ['Purple', schemes.purple]
    ]);

    return <Demo settings={<>
        {paletteS}
    </>}>
        <Stage title="default">
            <SchemeSelector value='default' palette={palette()} schemes={s} />
        </Stage>
    </Demo>;
}
