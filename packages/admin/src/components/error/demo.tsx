// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { paletteSelector } from '@admin/components/base/demo';
import { Error } from './error';

export default function() {
    const [paletteS, palette] = paletteSelector('primary');
    return <Error header='404' title='page not found' detail='detail' palette={palette()}>
        {paletteS}
    </Error>;
}
