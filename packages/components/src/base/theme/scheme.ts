// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT


export const transitionDurationName = '--default-transition-duration';

/**
 * 定义主题相关的各类变量
 */
export interface Scheme {
    // 对主题的修改，大部分是对 tailwind 主题的修改，其字段来源于：
    // https://github.com/tailwindlabs/tailwindcss/blob/main/packages/tailwindcss/theme.css

    /**
     * 用于指示当前主题颜色的对比度
     */
    contrast: number;

    /**
     * 全局字体的大小，该值将会修改 html 下的 font-size 属性。默认值为 16 px。
     */
    fontSize?: string;

    /**
     * 表示 tailwind 中 --radius-* 的数值，默认是 0.125
     */
    radius?: Radius;

    /**
     * 动画的时长，默认为 300，单位为 ms。
     */
    transitionDuration?: number;

    dark?: Palettes;
    light?: Palettes;
}

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
 * 改变主题色
 */
export function changeScheme(elem: HTMLElement, s?: Scheme) {
    if (!s) { return; }

    Object.entries(s).forEach(([k, v]) => {
        if (v === undefined) {
            return;
        }

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
        case 'light':
            Object.entries<string>(v).forEach(([k2, v2]) => {
                if (v2 !== undefined) {
                    elem.style.setProperty(`--${k}-${k2}`, v2);
                }
            });
            return;
        default:
            elem.style.setProperty(k, v);
        }
    });

    /*
     * 将 :root 中所有的变量复制到当前元素中
     * 因为部分变量本身又引用了其它变量，为了重新计算这些变量，需要将未计算的变量值复制到当前元素。
     */
    for (const sheet of document.styleSheets) {
        for (const rule of sheet.cssRules) {
            if (rule instanceof CSSStyleRule) {
                if (rule.selectorText === ':root') {
                    Object.entries(rule.style).forEach(([_, key]) => {
                        if (!key.startsWith('--')) {
                            return;
                        }

                        if (!elem.style.getPropertyValue(key)) { // 如果已经存在，说明上面的 Object.entries.foreach 已经设置过了。
                            elem.style.setProperty(key, rule.style.getPropertyValue(key));
                        }
                    });
                }
            }
        }
    }
}
