// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Result } from '@cmfx/components';
import { Error404 } from '@cmfx/illustrations';

import { paletteSelector } from '../base';

export default function() {
    const [paletteS, palette] = paletteSelector('primary');
    return <Result layout='vertical' title='page not found' palette={palette()} illustration={<Error404 />}>
        {paletteS}
    </Result>;
}
