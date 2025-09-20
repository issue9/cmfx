// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Result, illustrations } from '@cmfx/components';

import { paletteSelector } from '../base';

export default function() {
    const [paletteS, palette] = paletteSelector('primary');
    return <Result title='网站更新中' layout='auto' palette={palette()} illustration={<illustrations.Error404 />}>
        <div>网站更新中......</div>
        {paletteS}
    </Result>;
}
