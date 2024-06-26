// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

export const colors = ['primary' , 'secondary' , 'tertiary' , 'error'] as const;

/**
 * 几种主要的颜色
 */
export type Color = typeof colors[number];
