// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

// NOTE: 此文件可能被包括非源码目录下的多个文件引用，
// 不要在此文件中引用项目专用的一些功能，比如 vite.config.ts 中的 resolve.alias 的定义等。

/**
 * 定义了常用的屏幕尺寸
 *
 * JS 和 CSS 都会用到。
 */
export const breakpoints: Record<Breakpoint, string> = {
    // NOTE: 当屏幕从大到小变化，比如从 sm 向 xs 变化，会触发 sm 事件，且其 matches 为 false，
    // 但是不会触发 xs，因为 sm 本身也是符合 xs 的条件。

    xs: '(width >= 475px)',
    sm: '(width >= 640px)',
    md: '(width >= 768px)',
    lg: '(width >= 1024px)',
    xl: '(width >= 1280px)',
    xxl: '(width >= 1536px)',
    //xxxl: '(width >= 1600px)'
} as const;

const breakpointsOrder = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;

export type Breakpoint = typeof breakpointsOrder[number];

export interface BreakpointChange {
    (val: Breakpoint, old?: Breakpoint): void;
}

/**
 * 管理 breakpoint 事件
 */
export class Breakpoints {
    #events: Array<BreakpointChange>;
    #current: Breakpoint = 'sm'; // 赋值仅为防止报错，构函数通过 matchMedia 会进行初始化。

    constructor() {
        this.#events = [];

        Object.entries(breakpoints).forEach((item) => {
            const key = item[0] as Breakpoint;
            const mql = window.matchMedia(item[1]);

            const event = (ev: {matches: boolean}) => {
                if (ev.matches) {
                    this.#change(key);
                } else if (key != 'xs') {
                    this.#change(breakpointsOrder[breakpointsOrder.indexOf(key) - 1]);
                }
            };
            event(mql); // 先运行一次，获取初始的 #current。

            mql.addEventListener('change', event);
        });
    }

    #change(val: Breakpoint) {
        const old = this.#current;
        this.#events.forEach((e) => {
            e(val, old);
        });
        this.#current = val;
    }

    /**
     * 注册事件
     */
    onChange(...e: Array<BreakpointChange>) {
        e.map((e) => { // 注册的函数先运行一次
            e(this.#current);
        });

        this.#events.push(...e);
    }

    /**
     * 比较两个 Breakpoint 的大小
     *
     * - 0 表示相待；
     *  > 0 表示 v1 > v2；
     *  < 0 表示 v1 < v2；
     */
    static compare(v1: Breakpoint, v2: Breakpoint): number {
        return breakpointsOrder.indexOf(v1) - breakpointsOrder.indexOf(v2);
    }
}
