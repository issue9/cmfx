// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

export const states = ['enabled', 'disabled'] as const;

/**
 * 组件的状态类型
 */
export type State = (typeof states)[number];
