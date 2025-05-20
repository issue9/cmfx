// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

/**
 * 日历的插件接口
 */
export interface Plugin {
    (date: Date): JSX.Element;
}

const lunarFormatter = new Intl.DateTimeFormat('zh-CN-u-ca-chinese', { dateStyle: 'medium' });

/**
 * 实现了阴历的插件
 */
export function lunarPlugin(date: Date): JSX.Element {
    const s = lunarFormatter.format(date);
    const d = s.slice(-2);
    return d === '初一' ? s.slice(-4, -2) : d;
}
