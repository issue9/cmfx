// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { rand } from '@cmfx/core';

/**
 * 定义主题相关的各类变量
 */
export interface Scheme {
    // 对主题的修改，大部分是对 tailwind 主题的修改，其字段来源于：
    // https://github.com/tailwindlabs/tailwindcss/blob/main/packages/tailwindcss/theme.css

    /**
     * 全局字体的大小，该值将会修改 html 下的 font-size 属性。默认值为 16 px。
     */
    fontSize?: string;

    // TODO: shadow?: string;

    /**
     * 表示 tailwind 中 --radius-xs 的数值，默认是 0.125
     */
    radius?: Radius;

    /**
     * 表示 tailwind 中 --spacing 的数值，默认是 0.25
     */
    spacing?: number;

    /**
     * 动画的时长，默认为 300，单位为 ms。
     */
    transitionDuration?: number;

    dark: Colors;
    light: Colors;
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

export interface Colors {
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
            document.documentElement.style.fontSize = v;
            return;
        case 'spacing':
            elem.style.setProperty('--spacing', `${v}rem`);
            return;
        case 'radius':
            Object.entries<string>(v).forEach(([k2, v2]) => {
                if (v2 !== undefined) {
                    elem.style.setProperty(`--radius-${k2}`, `${v2}rem`);
                }
            });
            return;
        case 'transitionDuration':
            elem.style.setProperty('--default-transition-duration', `${v}ms`);
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
                        if (!key.startsWith('--') || key.startsWith('--bg') || key.startsWith('--fg')) {
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

/**
 * 根据给定的颜色值生成 Scheme 对象
 *
 * @param primary 主色调的色像值，[0-360] 之间，除去 error 之外的颜色都将根据此值自动生成；
 * @param error 指定 error 色盘的色像值，如果未指定，则采用默认值，不会根据 primary 而变化；
 * @param step 用于计算其它辅助色色像的步长；
 * @param fontSize 字体大小，如果未指定，则采用默认值；
 */
export function genScheme(primary: number, error?: number, step = 60, fontSize?: string): Scheme {
    if (step > 180) {
        throw '参数 step 不能大于 180';
    }

    let inc = (): number => {
        primary += step;
        if (primary > 360) {
            primary -= 360;
        }
        return primary;
    };

    const secondary = inc();
    const tertiary = inc();
    const surface = inc();

    const lightness = 1;
    const lLow = .3;
    const l = .2;
    const lHigh = .1;
    const invertLLow= lightness - lLow;
    const invertL = lightness - l;
    const invertLHigh = lightness - lHigh;

    const radius = rand(0.005, 2, 3);
    return {
        fontSize: fontSize,
        radius: {
            xs: radius,
            sm: radius * 2,
            md: radius * 3,
            lg: radius * 4,
            xl: radius * 5,
            '2xl': radius * 6,
            '3xl': radius * 7,
            '4xl': radius * 8,
        },
        spacing: rand(0.05, 0.5, 3),
        transitionDuration: rand(300, 1000, 0),
        dark: {
            'primary-bg-low': `oklch(${lLow} .2 ${primary})`,
            'primary-bg': `oklch(${l} .2 ${primary})`,
            'primary-bg-high': `oklch(${invertLHigh} .2 ${primary})`,
            'primary-fg-low': `oklch(${lLow} .4 ${primary})`,
            'primary-fg': `oklch(${l} .4 ${primary})`,
            'primary-fg-high': `oklch(${lHigh} .4 ${primary})`,

            'secondary-bg-low': `oklch(${invertLLow} .2 ${secondary})`,
            'secondary-bg': `oklch(${invertL} .2 ${secondary})`,
            'secondary-bg-high': `oklch(${invertLHigh} .2 ${secondary})`,
            'secondary-fg-low': `oklch(${lLow} .4 ${secondary})`,
            'secondary-fg': `oklch(${l} .4 ${secondary})`,
            'secondary-fg-high': `oklch(${lHigh} .4 ${secondary})`,

            'tertiary-bg-low': `oklch(${invertLLow} .2 ${tertiary})`,
            'tertiary-bg': `oklch(${invertL} .2 ${tertiary})`,
            'tertiary-bg-high': `oklch(${invertLHigh} .2 ${tertiary})`,
            'tertiary-fg-low': `oklch(${lLow} .4 ${tertiary})`,
            'tertiary-fg': `oklch(${l} .4 ${tertiary})`,
            'tertiary-fg-high': `oklch(${lHigh} .4 ${tertiary})`,

            'surface-bg-low': `oklch(${invertLLow} .01 ${surface})`,
            'surface-bg': `oklch(${invertL} .01 ${surface})`,
            'surface-bg-high': `oklch(${invertLHigh} .01 ${surface})`,
            'surface-fg-low': `oklch(${lLow} .1 ${surface})`,
            'surface-fg': `oklch(${l} .1 ${surface})`,
            'surface-fg-high': `oklch(${lHigh} .1 ${surface})`,
        
            'error-bg-low': `oklch(${invertLLow} .2 ${error})`,
            'error-bg': `oklch(${invertL} .2 ${error})`,
            'error-bg-high': `oklch(${invertLHigh} .2 ${error})`,
            'error-fg-low': `oklch(${lLow} .4 ${error})`,
            'error-fg': `oklch(${l} .4 ${error})`,
            'error-fg-high': `oklch(${lHigh} .4 ${error})`,
        },

        light: {
            'primary-bg-low': `oklch(${invertLLow} .2 ${primary})`,
            'primary-bg': `oklch(${invertL} .2 ${primary})`,
            'primary-bg-high': `oklch(${invertLHigh} .2 ${primary})`,
            'primary-fg-low': `oklch(${lLow} .4 ${primary})`,
            'primary-fg': `oklch(${l} .4 ${primary})`,
            'primary-fg-high': `oklch(${lHigh} .4 ${primary})`,

            'secondary-bg-low': `oklch(${invertLLow} .2 ${secondary})`,
            'secondary-bg': `oklch(${invertL} .2 ${secondary})`,
            'secondary-bg-high': `oklch(${invertLHigh} .2 ${secondary})`,
            'secondary-fg-low': `oklch(${lLow} .4 ${secondary})`,
            'secondary-fg': `oklch(${l} .4 ${secondary})`,
            'secondary-fg-high': `oklch(${lHigh} .4 ${secondary})`,

            'tertiary-bg-low': `oklch(${invertLLow} .2 ${tertiary})`,
            'tertiary-bg': `oklch(${invertL} .2 ${tertiary})`,
            'tertiary-bg-high': `oklch(${invertLHigh} .2 ${tertiary})`,
            'tertiary-fg-low': `oklch(${lLow} .4 ${tertiary})`,
            'tertiary-fg': `oklch(${l} .4 ${tertiary})`,
            'tertiary-fg-high': `oklch(${lHigh} .4 ${tertiary})`,

            'surface-bg-low': `oklch(${invertLLow} .01 ${surface})`,
            'surface-bg': `oklch(${invertL} .01 ${surface})`,
            'surface-bg-high': `oklch(${invertLHigh} .01 ${surface})`,
            'surface-fg-low': `oklch(${lLow} .1 ${surface})`,
            'surface-fg': `oklch(${l} .1 ${surface})`,
            'surface-fg-high': `oklch(${lHigh} .1 ${surface})`,

            'error-bg-low': `oklch(${invertLLow} .2 ${error})`,
            'error-bg': `oklch(${invertL} .2 ${error})`,
            'error-bg-high': `oklch(${invertLHigh} .2 ${error})`,
            'error-fg-low': `oklch(${lLow} .4 ${error})`,
            'error-fg': `oklch(${l} .4 ${error})`,
            'error-fg-high': `oklch(${lHigh} .4 ${error})`,
        },
    };
}

/**
 * 生成一组主题数据
 *
 * @param primary 第一个主题的主色调；
 * @param size 生成的量；
 * @param step 用于计算每一组主题色的辅助色色像步长；
 */
export function genSchemes(primary: number, size = 16, step = 60): Array<Scheme> {
    const schemes: Array<Scheme> = [];
    for (let i = 0; i < size; i++) {
        schemes.push(genScheme(primary + i * 48, undefined, step));
    }
    return schemes;
}
