// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { transitionDurationName } from './scheme';

export const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

/**
 * 支持的屏幕类型
 */
export type Breakpoint = typeof breakpoints[number];

/**
 * 获取动画的过滤时间，即 CSS 的 --default-transition-duration 变量的值。
 *
 * @param el - 获取该 CSS 变量的元素，如果为 undefined，则使用 {@link document.documentElement} 即根主题中定义的值；
 * @returns 返回以毫秒为单位的数值；
 */
export function transitionDuration(el?: Element): number {
    let val = getComputedStyle(el || document.documentElement).getPropertyValue(transitionDurationName);
    if (!val) {
        return 300;
    }

    if (val.endsWith('ms')) {
        return parseInt(val.substring(0, val.length - 2));
    } else if (val.endsWith('s')) {
        return parseInt(val.substring(0, val.length - 1)) * 1000;
    } else { // 其它直接当作数值处理
        return parseInt(val);
    }
}
