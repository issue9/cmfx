// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { default as XDivider } from './divider';

export default function() {
    return <div class="w-80 p-5">
        <XDivider color="primary" />

        <br />
        <XDivider color="primary" pos='start'><span class="material-symbols-outlined">face</span>起始位置</XDivider>

        <br />
        <XDivider pos='end'>结束位置</XDivider>

        <br />
        <XDivider color="primary" pos='center'>中间</XDivider>
    </div >
}
