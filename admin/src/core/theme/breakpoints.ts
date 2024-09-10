// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

// NOTE: 此文件可能被包括非源码目录下的多个文件引用，
// 不要在此文件中引用项目专用的一些功能，比如 vite.config.ts 中的 resolve.alias 的定义等。

const breakpointsOrder = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;

export type Breakpoint = typeof breakpointsOrder[number];

/**
 * 定义了常用的屏幕尺寸
 */
export const breakpoints: Readonly<Record<Breakpoint, string>> = {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    xxl: '1536px',
    //xxxl: '1600px'
};

type BreakpointsMedia = Record<Breakpoint, string>;

/**
 * 根据 {@link breakpoints} 生成的媒体查询样式
 */
export const breakpointsMedia: Readonly<BreakpointsMedia> = Object.entries(breakpoints).reduce<BreakpointsMedia>((obj, [key, val])=>{
    obj[key as Breakpoint] = `(width >= ${val})`;
    return obj;
}, {} as BreakpointsMedia);

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

        Object.entries(breakpointsMedia).forEach((item) => {
            const key = item[0] as Breakpoint;
            const mql = window.matchMedia(item[1]);

            // 当屏幕从大到小变化，比如从 sm 向 xs 变化，会触发 sm 事件，且其 matches 为 false，
            // 但是不会触发 xs，因为 sm 本身也是符合 xs 的条件。
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
