// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { SchemeBuilder } from '@cmfx/components';

import { Demo, paletteSelector } from '../base';

export default function () {
    const [paletteS, palette] = paletteSelector();

    return <Demo settings={<>
        {paletteS}
    </>}>
        <SchemeBuilder palette={palette()} />
    </Demo>;
}
