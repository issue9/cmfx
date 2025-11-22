// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT


export const transitionDurationName = '--default-transition-duration';

/**
 * 定义主题相关的各类变量
 */
export type Scheme = {
    // 对主题的修改，大部分是对 tailwind 主题的修改，其字段来源于：
    // https://github.com/tailwindlabs/tailwindcss/blob/main/packages/tailwindcss/theme.css

    primary: string;
    secondary: string;
    tertiary: string;
    error: string;
    surface: string;

    // NOTE: 主题颜色值是必须要定义的，不能从父元素继承。

    /**
     * 全局字体的大小
     *
     * @remarks
     * 该值将会修改 html 下的 font-size 属性。默认值为 16px。
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
};

/**
 * 圆角参数的设置
 *
 * @remarks
 * 单位为 rem。属性名表示的是组件的大小。
 */
export type Radius = {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
};

export const palettes = ['primary' , 'secondary' , 'tertiary' , 'error', 'surface'] as const;

/**
 * 组件可用的几种色盘
 *
 * @remarks 当为组件指定一个色盘时，并不是直接改变相应在的颜色，而是在该组件上指定相应在的颜色变量，
 * 具体可参考 /tailwind.css 中的 `palette--primary` 等相关的定义。
 */
export type Palette = typeof palettes[number];

/**
 * 改变主题色
 */
export function changeScheme(elem: HTMLElement, s?: Scheme) {
    if (!s) { return; }

    if (s.fontSize) { document.documentElement.style.fontSize = s.fontSize; }

    if (s.radius) {
        Object.entries(s.radius).forEach(([k2, v2]) => {
            if (v2 !== undefined) { elem.style.setProperty(`--radius-${k2}`, `${v2}rem`); }
        });
    }

    if (s.transitionDuration) {
        elem.style.setProperty(transitionDurationName, `${s.transitionDuration}ms`);
    }

    if (s.primary) { elem.style.setProperty('--primary', s.primary); }
    if (s.secondary) { elem.style.setProperty('--secondary', s.secondary); }
    if (s.tertiary) { elem.style.setProperty('--tertiary', s.tertiary); }
    if (s.error) { elem.style.setProperty('--error', s.error); }
    if (s.surface) { elem.style.setProperty('--surface', s.surface); }

    // --palette-bg 等变量引用的值 --primary 已经改变。
    // 需要复制这些变量到当前元素，让元素重新计算 --palette-bg 等变量的值。
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
