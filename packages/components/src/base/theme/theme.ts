// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { transitionDurationName } from './scheme';

export const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

export type Breakpoint = typeof breakpoints[number];

/**
 * 获取动画的过滤时间，即 CSS 的 --default-transition-duration 变量的值。
 *
 * @param preset - 默认值，找不到时返回该值，单位为毫秒；
 * @returns 返回以毫秒为单位的数值；
 */
export function transitionDuration(preset: number): number {
    let val = getComputedStyle(document.documentElement).getPropertyValue(transitionDurationName);
    if (!val) {
        return preset;
    }

    if (val.endsWith('ms')) {
        return parseInt(val.substring(0, val.length - 2));
    } else if (val.endsWith('s')) {
        return parseInt(val.substring(0, val.length - 1))*1000;
    } else { // 其它直接当作数值处理
        return parseInt(val);
    }
}
