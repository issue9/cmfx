// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import IconClose from '~icons/material-symbols/close';
import IconFace from '~icons/material-symbols/face';
import IconPerson from '~icons/material-symbols/person';

import { Demo } from './base';

export default function() {
    return <Demo>
        <IconFace class="bg-palette-bg-low rounded-full hover:text-palette-fg-high" />
        <IconPerson class="border border-palette-fg-high" />

        <span class="w-full border border-red-500 flex items-center bg-palette-fg-high"><IconFace />与文字文字平行<IconClose /></span>
        <span class='text-8xl w-full border border-red-500 flex items-center'><IconFace />与文字平行 6rem<IconClose /></span>

        <span class="h-12 flex items-center w-full border border-red-500"><IconFace />与文字文字平行<IconFace /></span>
    </Demo>;
}
