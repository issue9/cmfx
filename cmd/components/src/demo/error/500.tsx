// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Error, illustrations } from '@cmfx/components';

import { paletteSelector } from '../base';

export default function() {
    const [paletteS, palette] = paletteSelector('primary');
    return <Error title='internal server error' palette={palette()} illustration={<illustrations.Error500 />}>
        {paletteS}
    </Error>;
}
