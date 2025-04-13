// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Config } from '@core/config';

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

export function getScheme(c: Config, preset: Scheme) {
    let ret = c.get<Scheme>(key);
    if (!ret) {
        ret = preset;
    }
    return ret;
}

/**
 * 改变主题色
 *
 * 此方法提供了动态改变主题色的方法，发生在 theme.css 应用之后。
 */
export function changeScheme(c: Config, s: Scheme) {
    Object.entries(s).forEach((o)=>{
        if (o[1] !== undefined) {
            document.documentElement.style.setProperty('--'+o[0], o[1]);
        }
    });

    c.set(key, s);
}

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

export function genSchemes(primary: number, size = 16, step = 60): Array<Scheme> {
    const schemes: Array<Scheme> = [];
    for (let i = 0; i < size; i++) {
        schemes.push(genScheme(primary + i * 48, undefined, step));
    }
    return schemes;
}
