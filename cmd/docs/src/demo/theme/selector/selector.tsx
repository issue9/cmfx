// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Scheme, schemes, SchemeSelector } from '@cmfx/components';

import { paletteSelector } from '../../base';

export default function() {
    const [paletteS, palette] = paletteSelector();
    const s = new Map<string, Scheme>([
        ['Green', schemes.green],
        ['Purple', schemes.purple]
    ]);

    return <div>
        {paletteS}
        <SchemeSelector value='default' palette={palette()} schemes={s} />
    </div>;
}
