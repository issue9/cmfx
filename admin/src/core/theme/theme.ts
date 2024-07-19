// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Contrast } from './contrast';
import { initMode, Mode } from './mode';
import { initScheme, Scheme } from './scheme';

export function init(mode: Mode, scheme: number | Scheme, contrast: Contrast) {
    initMode(mode);
    initScheme(scheme);
    // scheme 如果未指定，则应该采用此值初始化一个 Scheme 对象
    // TODO
}
