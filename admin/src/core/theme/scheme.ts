// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

const key = 'theme_scheme';

/**
 * 定义主题中与颜色相关的变量
 *
 * 各个字段与 theme.css 中的同名的变量对应。
 */
export interface Scheme {
    primary: number;
    secondary?: number;
    tertiary?: number;
    surface?: number;
    error?: number;
}

/**
 * 根据给定的颜色值生成 Scheme 对象
 */
export function genScheme(primary: number): Scheme {
    const step = 60;

    let inc = (): number => {
        primary += step;
        if (primary > 360) {
            primary -= 360;
        }
        return primary;
    };

    return {
        primary: inc(),
        secondary: inc(),
        tertiary: inc(),
        surface: inc()
    };
}

export function initScheme(preset: Scheme | number) {
    const str = localStorage.getItem(key);
    if (str) { // 保存在 localStorage 中的必然是对象
        preset = JSON.parse(str) as Scheme;
    }
    changeScheme(preset);
}

/**
 * 改变主题色
 *
 * 此方法提供了动态改变主题色的方法，但是在项目加载时依然会采用 theme.css 中的 --primary 等几个变量的定义。
 * 如果需要改变原始值，可以直接修改 theme.css 中相关的变量，或是在后续的 CSS 文件中对这些变量进行修改。
 */
export function changeScheme(c: Scheme | number) {
    if (typeof c === 'number') {
        c = genScheme(c);
    }

    Object.entries(c).forEach((o)=>{
        document.documentElement.style.setProperty('--'+o[0], o[1]);
    });
}
