// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Dropdown } from '@cmfx/components';

import { paletteSelector } from '../base';

export default function() {
    const [paletteS, palette] = paletteSelector('primary');
    return <div>
        {paletteS}
        <Dropdown palette={palette()} items={[]}>
            <div class="bg-primary-bg text-primary-fg w-full h-full">click</div>
        </Dropdown>
    </div>;
}
