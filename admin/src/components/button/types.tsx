// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

export const styles = ['flated' , 'bordered' , 'filled'] as const;

export type Style = typeof styles[number];
