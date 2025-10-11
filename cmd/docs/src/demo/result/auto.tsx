// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Result } from '@cmfx/components';
import { Error404 } from '@cmfx/illustrations';

import { paletteSelector } from '../base';

export default function() {
    const [paletteS, palette] = paletteSelector('primary');
    return <Result title='网站更新中' layout='auto' palette={palette()} illustration={<Error404 />}>
        <div>网站更新中......</div>
        {paletteS}
    </Result>;
}
