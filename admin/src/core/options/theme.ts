// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

export enum Mode {
    System, // 跟随系统
    Dark,
    Light
}

export enum Contrast {
    Standard,
    Medium,
    High
}

export interface Theme {
    mode: Mode,
    contrast: Contrast,
    primary: string
}

export function checkTheme(t: Theme) {
    if (!/^#?([0-9A-F]{3}){1,2}$/i.test(t.primary)) {
        throw '无效的格式 primary';
    }
}
