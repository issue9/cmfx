// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

export const schemes = ['primary' , 'secondary' , 'tertiary' , 'error'] as const;

export type Scheme = typeof schemes[number];

/**
 * 元素的四个角
 */
export const corners = ['topleft', 'topright', 'bottomleft', 'bottomright'] as const;

export type Corner = typeof corners[number];
