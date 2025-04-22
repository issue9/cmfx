// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Error } from '@cmfx/components';

import { paletteSelector } from './base';

export default function() {
    const [paletteS, palette] = paletteSelector('primary');
    return <Error header='404' title='page not found' detail='detail' palette={palette()}>
        {paletteS}
    </Error>;
}
