// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Contrast, changeContrast, getContrast } from './contrast';
import { Mode, changeMode, getMode } from './mode';
import { Scheme, changeScheme, getScheme } from './scheme';

/**
 * 初始化主题
 */
export function init(mode: Mode, scheme: number | Scheme, contrast: Contrast) {
    changeMode(getMode(mode));
    changeScheme(getScheme(scheme));
    changeContrast(getContrast(contrast));
}
