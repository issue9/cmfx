// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Result, illustrations } from '@cmfx/components';

import { paletteSelector } from '../base';

export default function() {
    const [paletteS, palette] = paletteSelector('primary');
    return <Result layout='vertical' title='page not found' palette={palette()} illustration={<illustrations.Error404 />}>
        {paletteS}
    </Result>;
}
