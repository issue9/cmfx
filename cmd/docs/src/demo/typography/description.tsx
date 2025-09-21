// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Description } from '@cmfx/components';
import IconEye from '~icons/material-symbols/table-eye';

import { paletteSelector } from '../base';

export default function() {
    const [paletteS, palette] = paletteSelector();

    return <div>
        {paletteS}
        <Description palette={palette()} icon={<IconEye />} title='title'>
            description<br />
            description
        </Description>

        <br />
        <br />

        <Description palette={palette()}>
            无标题<br />
            description
        </Description>
    </div>;
}
