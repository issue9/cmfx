// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 生成随机数
 * @param min 随机数的下限，包含此值在内；
 * @param max 随机数的上限，包含此值在内；
 * @param decimals 小数位数，如果小于等于 0，则返回整数；
 */
export function rand(min: number, max: number, decimals: number): number {
    const r = Math.random() * (max - min) + min;

    if (decimals <= 0) { return Math.floor(r); }
    return round(r, decimals);
}

/**
 * 四舍五入丢弃多余的小数位，只留下 digits 指定的小数位数
 * @param num 数值；
 * @param decimals 小数位数；
 */
export function round(num: number, decimals: number): number {
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
}
