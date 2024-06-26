// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

export const types = ['flat' , 'border' , 'filled'] as const;

export type Type = typeof types[number];
