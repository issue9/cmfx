// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Error, illustrations } from '@cmfx/components';

import { paletteSelector } from '../base';

export default function() {
    const [paletteS, palette] = paletteSelector('primary');
    return <Error title='网站更新中' palette={palette()} illustration={<illustrations.Building />}>
        <div class="w-full">网站更新中......</div>
        {paletteS}
    </Error>;
}
