// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

/**
 * 日历的插件接口
 *
 * 可以在日历的每个方格上显示一些额外的信息，例如农历、节假日等。
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
    if (d !== '初一') { return d; }

    const m = s.slice(-5, -2);
    if (m === '十一月' || m === '十二月') { return m; }

    return s.slice(-4, -2);
}
