// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Contrast, changeContrast, contrasts } from './contrast';
import { Mode, changeMode, modes } from './mode';
import { Scheme, changeScheme, genScheme, genSchemes } from './scheme';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * 提供与主题相关的接口
 */
export class Theme {
    static readonly contrasts = contrasts;
    static readonly modes = modes;

    /**
     * 根据给定的颜色值生成 Scheme 对象
     *
     * @param primary 主色调的色像值，[0-360] 之间，除去 error 之外的颜色都将根据此值自动生成；
     * @param error 指定 error 色盘的色像值，如果未指定，则采用默认值，不会根据 primary 而变化；
     * @param step 用于计算其它辅助色色像的步长；
     */
    static genScheme(primary: number, error?: number, step = 60) {  return genScheme(primary, error, step); }

    /**
     * 生成一组主题数据
     *
     * @param primary 第一个主题的主色调；
     * @param size 生成的量；
     * @param step 用于计算每一组主题色的辅助色色像步长；
     */
    static genSchemes(primary: number, size = 16, step = 60) { return genSchemes(primary, size, step); }

    /**
     * 获取动画的过滤时间，即 CSS 的 --transition-duration 变量的值。
     *
     * @param preset 默认值，找不到时返回该值，单位为毫秒；
     * @returns 返回以毫秒为单位的数值；
     */
    static transitionDuration(preset: number): number {
        let val = getComputedStyle(document.documentElement).getPropertyValue('--transition-duration');
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
    static apply(elem: HTMLElement, t: Theme) {
        changeScheme(elem, t.#scheme);
        changeMode(elem, t.#mode);
        changeContrast(elem, t.#contrast);
    }

    #scheme: Scheme;
    #contrast: Contrast;
    #mode: Mode;

    /**
     * 修改主题
     *
     * @param elem 应用的元素，其子元素将被应用此主题；
     * @param scheme 主题值；
     * @param mode 模式值；
     * @param contrast 对比度值；
     */
    constructor(scheme: Scheme|number, mode?: Mode, contrast?: Contrast) {
        this.#scheme = typeof(scheme) === 'number' ? genScheme(scheme) :  scheme;
        this.#mode = mode || 'system';
        this.#contrast = contrast || 'nopreference';
    }

    get mode() { return this.#mode; }

    get contrast() { return this.#contrast; }

    get scheme() { return this.#scheme; }
}
