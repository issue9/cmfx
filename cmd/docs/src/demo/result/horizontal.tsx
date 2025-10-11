// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Result } from '@cmfx/components';
import { Error404 } from '@cmfx/illustrations';

import { paletteSelector } from '../base';

export default function() {
    const [paletteS, palette] = paletteSelector('primary');
    return <Result layout='horizontal' title='internal server error' palette={palette()} illustration={<Error404 />}>
        {paletteS}
    </Result>;
}
