// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

export const colors = ['primary' , 'secondary' , 'tertiary' , 'error'] as const;

export type Color = typeof colors[number];
