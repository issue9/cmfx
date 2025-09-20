// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Empty } from '@cmfx/components';
import IconEye from '~icons/material-symbols/eyeglasses';

import { paletteSelector } from '../base';

export default function() {
    const [paletteS, palette] = paletteSelector();

    return <div>
        {paletteS}
        <Empty palette={palette()} icon={IconEye}>说点什么呢？</Empty>
    </div>;
}
