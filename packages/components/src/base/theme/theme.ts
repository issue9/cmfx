// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT
 
import { changeContrast, changeMode, changeScheme, Contrast, Mode, Scheme } from '@/base';

export const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

export type Breakpoint = typeof breakpoints[number];

/**
 * 获取动画的过滤时间，即 CSS 的 --default-transition-duration 变量的值。
 *
 * @param preset 默认值，找不到时返回该值，单位为毫秒；
 * @returns 返回以毫秒为单位的数值；
 */
export function transitionDuration(preset: number): number {
    let val = getComputedStyle(document.documentElement).getPropertyValue('--default-transition-duration');
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

/**
 * 将主题 t 应用到元素 elem
 */
export function applyTheme(elem: HTMLElement, t: Theme) {
    elem.setAttribute('data-theme', '1');
    changeScheme(elem, t.scheme);
    changeMode(elem, t.mode);
    changeContrast(elem, t.contrast);
}

/**
 * 判断元素 elem 上是否被应用了主题
 */
export function hasTheme(elem: HTMLElement): boolean {
    return elem.hasAttribute('data-theme');
}

/**
 * 提供与主题相关的接口
 */
export interface Theme {
    scheme?: Scheme;
    contrast?: Contrast;
    mode?: Mode;
}