// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Demo } from '@/components/base/demo';
import { Icon } from './icon';

export default function() {
    return <Demo>
        <Icon icon="face" />
        <span class="c--icon">person</span>

        <span class="w-full border border-red-500 flex items-center"><Icon icon="face" />与文字文字平行<Icon icon="close" /></span>
        <span class='text-8xl w-full border border-red-500 flex items-center'><Icon icon="face" />与文字平行 6rem<Icon icon="close" /></span>
        <span class="w-full border border-red-500 flex items-center"><span class="c--icon">face</span>与文字文字平行<span class="c--icon">close</span></span>

        <span class="h-12 flex items-center w-full border border-red-500"><Icon icon="face" />与文字文字平行<Icon icon="face" /></span>
    </Demo>;
}
