// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

export const styles = ['dotted', 'solid', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset'] as const;

export type Style = typeof styles[number];
