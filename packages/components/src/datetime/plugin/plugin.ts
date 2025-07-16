// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 插件接口
 *
 * 可对每个日期的方格 {@link HTMLTableCellElement} 对象进行自定义操作。
 */
export interface Plugin {
    /**
     * @param date 日期；
     * @param el 单元格对象；
     */
    (date: Date, el: HTMLTableCellElement): void;
}

const lunarFormatter = new Intl.DateTimeFormat('zh-CN-u-ca-chinese', { dateStyle: 'medium' });

/**
 * 实现了阴历的插件
 */
export function lunar(date: Date, el: HTMLTableCellElement): void {
    const s = lunarFormatter.format(date);

    let txt = s.slice(-2);
    if (txt === '初一') {
        const m = s.slice(-5, -2);
        txt = (m === '十一月' || m === '十二月') ? m : s.slice(-4, -2);
    }

    const span = document.createElement('span');
    span.append(txt);
    el.append(span);
}
