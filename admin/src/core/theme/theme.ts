// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { breakpointsOrder, breakpointsMedia, Breakpoint } from './breakpoints';
import { Contrast, changeContrast, getContrast, contrasts } from './contrast';
import { Mode, changeMode, getMode, modes } from './mode';
import { Scheme, changeScheme, genScheme, genSchemes, getScheme } from './scheme';

export interface BreakpointChange {
    (val: Breakpoint, old?: Breakpoint): void;
}

/**
 * 提供与主题相关的接口
 */
export class Theme {
    static readonly contrasts = contrasts;
    static readonly modes = modes;
    static readonly breakpoints = breakpointsOrder;

    // 几个属性的默认值
    static #scheme: Scheme;
    static #contrast: Contrast;
    static #mode: Mode;

    static #breakpointEvents: Array<BreakpointChange>;
    static #breakpoint: Breakpoint; // 会在构造函数初始化。

    /**
     * 初始化主题
     *
     * @param scheme 默认的主题值，如果为 number 类型，则采用 {@link Theme#genScheme} 生成 {@link Scheme} 对象；
     * @param mode 默认的模式；
     * @param contrast 默认的对比度；
     */
    static init(scheme: number | Scheme, mode: Mode = 'system', contrast: Contrast = 'nopreference') {
        if (typeof scheme === 'number') {
            scheme = genScheme(scheme);
            Theme.#scheme = scheme;
        }
        changeScheme(getScheme(scheme));

        Theme.#mode = mode;
        changeMode(getMode(mode));

        Theme.#contrast = contrast;
        changeContrast(getContrast(contrast));

        Theme.#initBreakpoint();
    }

    static #initBreakpoint() {
        Theme.#breakpointEvents = [];

        Object.entries(breakpointsMedia).forEach((item) => {
            const key = item[0] as Breakpoint;
            const mql = window.matchMedia(item[1]);

            // 当屏幕从大到小变化，比如从 sm 向 xs 变化，会触发 sm 事件，且其 matches 为 false，
            // 但是不会触发 xs，因为 sm 本身也是符合 xs 的条件。
            const event = (ev: {matches: boolean}) => {
                if (ev.matches) {
                    Theme.#change(key);
                } else if (key != 'xs') {
                    Theme.#change(breakpointsOrder[breakpointsOrder.indexOf(key) - 1]);
                }
            };
            event(mql); // 先运行一次，获取初始的 #current。

            mql.addEventListener('change', event);
        });
    }

    static #change(val: Breakpoint) {
        const old = Theme.#breakpoint;
        Theme.#breakpointEvents.forEach((e) => {
            e(val, old);
        });
        Theme.#breakpoint = val;
    }

    static get breakpoint(): Breakpoint { return Theme.#breakpoint; }

    /**
     * 注册屏幕尺寸发生变化时的处理事件
     */
    static onBreakpoint(...e: Array<BreakpointChange>) {
        e.map((e) => { // 注册的函数先运行一次
            e(Theme.#breakpoint);
        });

        Theme.#breakpointEvents.push(...e);
    }

    static get mode() { return getMode(Theme.#mode); }

    static set mode(m: Mode) { changeMode(m); }

    static get contrast() { return getContrast(Theme.#contrast); }

    static set contrast(v: Contrast) { changeContrast(v); }

    static get scheme() { return getScheme(Theme.#scheme); }

    static set scheme(v: Scheme) { changeScheme(v); }

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
     * @param primary 第一个主题的主色调
     * @param size 生成的量
     */
    static genSchemes(primary: number, size = 16) { return genSchemes(primary, size); }
}
