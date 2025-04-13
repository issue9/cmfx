// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 分隔线可用的风格
 */
export const styles = ['dotted', 'solid', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset'] as const;

export type Style = typeof styles[number];
