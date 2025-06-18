// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Error, illustrations } from '@cmfx/components';

import { paletteSelector } from '../base';

export default function() {
    const [paletteS, palette] = paletteSelector('primary');
    return <Error title='page not found' palette={palette()} illustration={<illustrations.BUG />}>
        {paletteS}
    </Error>;
}
