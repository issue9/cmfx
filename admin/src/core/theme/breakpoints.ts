// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

// NOTE: 此文件可能被包括非源码目录下的多个文件引用，
// 不要在此文件中引用项目专用的一些功能，比如 vite.config.ts 中的 resolve.alias 的定义等。

// 从小到大排列
export const breakpointsOrder = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;

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

/**
 * 比较两个 Breakpoint 的大小
 *
 * - 0 表示相待；
 *  > 0 表示 v1 > v2；
 *  < 0 表示 v1 < v2；
 */
export function compareBreakpoint(v1: Breakpoint, v2: Breakpoint): number {
    return breakpointsOrder.indexOf(v1) - breakpointsOrder.indexOf(v2);
}
