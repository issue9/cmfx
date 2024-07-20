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

export function getScheme(preset: Scheme | number): Scheme | number {
    const str = localStorage.getItem(key);
    if (str) { // 保存在 localStorage 中的必然是对象
        return JSON.parse(str) as Scheme;
    }
    return preset;
}

/**
 * 改变主题色
 *
 * 此方法提供了动态改变主题色的方法，发生在 theme.css 应用之后。
 */
export function changeScheme(c: Scheme | number) {
    if (typeof c === 'number') {
        c = genScheme(c);
    }

    Object.entries(c).forEach((o)=>{
        if (o[1] !== undefined) {
            document.documentElement.style.setProperty('--'+o[0], o[1]);
        }
    });

    const str = JSON.stringify(c);
    localStorage.setItem(key, str);
}

/**
 * 根据给定的颜色值生成 Scheme 对象
 *
 * @param primary 主色调的色像值，[0-360] 之间，除去 error 之外的颜色都将根据此值自动生成；
 * @param error 指定 error 色盘的色像值，如果未指定，则采用默认值，不会根据 primary 而变化；
 * @param step 用于计算其它辅助色色像的步长；
 */
export function genScheme(primary: number, error?: number, step = 60): Scheme {
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

    return {
        primary: primary,
        secondary: inc(),
        tertiary: inc(),
        surface: inc(),
        error: error
    };
}
