// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

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
export const breakpointsMedia: Readonly<BreakpointsMedia> = Object.entries(breakpoints).reduce<BreakpointsMedia>((obj, [key, val]) => {
    obj[key as Breakpoint] = `(width >= ${val})`;
    return obj;
}, {} as BreakpointsMedia);

const config: PresetsConfig = {
    darkMode: 'selector',
    theme: {
        // 重定义 screens 属性，而不是扩展。
        screens: buildScreens(),
    }
};

function buildScreens() {
    const screens: ScreensConfig  = {};
    Object.entries(breakpointsMedia).forEach((item) => {
        // NOTE: 当屏幕从大到小变化，比如从 sm 向 xs 变化，会触发 sm 事件，且其 matches 为 false，
        // 但是不会触发 xs，因为 sm 本身也是符合 xs 的条件。
        screens[item[0]] = { 'raw': item[1]};
    });
    return screens;
}

export default config;
