// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Label } from '@cmfx/components';
import IconEye from '~icons/material-symbols/table-eye';

import { paletteSelector } from '../base';

export default function() {
    const [paletteS, palette] = paletteSelector();

    return <div>
        {paletteS}
        <Label palette={palette()} icon={<IconEye />} tag='div'>Label</Label>
    </div>;
}
