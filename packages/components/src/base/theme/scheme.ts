// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT


export const transitionDurationName = '--default-transition-duration';

/**
 * 定义主题相关的各类变量
 */
export interface Scheme {
    [k: string]: any;

    // 对主题的修改，大部分是对 tailwind 主题的修改，其字段来源于：
    // https://github.com/tailwindlabs/tailwindcss/blob/main/packages/tailwindcss/theme.css

    /**
     * 用于指示当前主题颜色的对比度
     */
    contrast: number;

    // NOTE: 主题颜色值是必须要定义的，不能从父元素继承。

    dark: Palettes;
    light: Palettes;

    /**
     * 全局字体的大小
     *
     * @remarks 该值将会修改 html 下的 font-size 属性。默认值为 16px。
     * 当多个主题嵌套设置时，最后调用 changeScheme 的 font-size 会应用到全局。
     */
    fontSize?: string;

    /**
     * 表示 tailwind 中 --radius-* 的数值
     */
    radius?: Radius;

    /**
     * 动画的时长，默认为 300，单位为 ms。
     */
    transitionDuration?: number;
}

/**
 * 圆角参数的设置，单位为 rem。
 */
export interface Radius {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
}

export interface Palettes {
    [key: string]: string;

    'primary-fg': string;
    'primary-fg-low': string;
    'primary-fg-high': string;
    'primary-bg': string;
    'primary-bg-low': string;
    'primary-bg-high': string;

    'secondary-fg': string;
    'secondary-fg-low': string;
    'secondary-fg-high': string;
    'secondary-bg': string;
    'secondary-bg-low': string;
    'secondary-bg-high': string;

    'tertiary-fg': string;
    'tertiary-fg-low': string;
    'tertiary-fg-high': string;
    'tertiary-bg': string;
    'tertiary-bg-low': string;
    'tertiary-bg-high': string;

    'error-fg': string;
    'error-fg-low': string;
    'error-fg-high': string;
    'error-bg': string;
    'error-bg-low': string;
    'error-bg-high': string;

    'surface-fg': string;
    'surface-fg-low': string;
    'surface-fg-high': string;
    'surface-bg': string;
    'surface-bg-low': string;
    'surface-bg-high': string;
}

/**
 * 组件可用的几种色盘
 *
 * 当为组件指定一个色盘时，并不是直接改变相应在的颜色，而是在该组件上指定相应在的颜色变量，
 * 具体可参考 /tailwind.css 中的 palette--primary 等相关的定义。
 */
export const palettes = ['primary' , 'secondary' , 'tertiary' , 'error', 'surface'] as const;

export type Palette = typeof palettes[number];

/**
 * 计算与 p 不同的另一个色盘
 */
export function nextPalette(p: Palette): Palette {
    const index = palettes.indexOf(p);
    return palettes[(index + 1) % palettes.length];
}

/**
 * 改变主题色
 */
export function changeScheme(elem: HTMLElement, s?: Scheme) {
    if (!s) { return; }

    Object.entries(s).forEach(([k, v]) => {
        if (v === undefined) { return; }

        switch (k) {
        case 'fontSize':
            if (v) {
                document.documentElement.style.fontSize = v;
            }
            return;
        case 'radius':
            Object.entries<string>(v).forEach(([k2, v2]) => {
                if (v2 !== undefined) {
                    elem.style.setProperty(`--radius-${k2}`, `${v2}rem`);
                }
            });
            return;
        case 'transitionDuration':
            elem.style.setProperty(transitionDurationName, `${v}ms`);
            return;
        case 'dark':
            Object.entries<string>(v).forEach(([k2, v2]) => {
                elem.style.setProperty(`--${k2}`, `light-dark(${s.light[k2]}, ${v2})`);
            });
            return;
        default:
            elem.style.setProperty(k, v);
        }
    });

    // --bg 等变量引用的值 --primary-bg 已经改变。
    // 需要复制这些变量到当前元素，让元素重新计算 --bg 等变量的值。
    for (const sheet of document.styleSheets) {
        for (const rule of sheet.cssRules) {
            if (rule instanceof CSSStyleRule) {
                if (rule.selectorText === ':root') {
                    Object.entries(rule.style).forEach(([_, key]) => {
                        if (!key.startsWith('--')) {
                            return;
                        }

                        // 如果已经存在，说明当前主题中有定义，不需要复制。
                        if (!elem.style.getPropertyValue(key)) {
                            elem.style.setProperty(key, rule.style.getPropertyValue(key));
                        }
                    });
                }
            }
        }
    }
}
