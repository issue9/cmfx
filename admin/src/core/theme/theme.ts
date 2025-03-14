// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Config } from '@/core/config';
import { Contrast, changeContrast, contrasts, getContrast } from './contrast';
import { Mode, changeMode, getMode, modes } from './mode';
import { Scheme, changeScheme, genScheme, genSchemes, getScheme } from './scheme';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * 提供与主题相关的接口
 */
export class Theme {
    static readonly contrasts = contrasts;
    static readonly modes = modes;

    static #config: Config;

    static #scheme: Scheme;
    static #contrast: Contrast;
    static #mode: Mode;

    /**
     * 初始化主题
     *
     * @param scheme 默认的主题值；
     * @param mode 默认的模式；
     * @param contrast 默认的对比度；
     */
    static init(conf: Config, scheme: Scheme, mode: Mode = 'system', contrast: Contrast = 'nopreference') {
        Theme.#scheme = scheme;
        Theme.#mode = mode;
        Theme.#contrast = contrast;
        Theme.switchConfig(conf);
    }

    /**
     * 获取动画的过滤时间，即 CSS 的 --transition-duration 变量的值。
     *
     * @param preset 默认值，找不到时返回该值，单位为毫秒；
     * @param 返回以毫秒为单位的数值；
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
     * 切换配置
     */
    static switchConfig(conf: Config) {
        Theme.#config = conf;

        const s = getScheme(conf, Theme.#scheme);
        changeScheme(conf, s);
        Theme.#scheme = s;

        const m = getMode(conf, Theme.#mode);
        changeMode(conf, m);
        Theme.#mode = m;

        const c = getContrast(conf, Theme.#contrast);
        changeContrast(conf, c);
        Theme.#contrast = c;
    }

    static mode() { return Theme.#mode; }

    static setMode(m: Mode) {
        changeMode(Theme.#config, m);
        Theme.#mode = m;
    }

    static contrast() { return Theme.#contrast; }

    static setContrast(v: Contrast) {
        changeContrast(Theme.#config, v);
        Theme.#contrast = v;
    }

    static scheme() { return Theme.#scheme; }

    static setScheme(v: Scheme) {
        changeScheme(Theme.#config, v);
        Theme.#scheme = v;
    }

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
}
