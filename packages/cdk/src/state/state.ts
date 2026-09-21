// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 组件的所有可能状态
 */
export const states = ['enabled', 'disabled', 'readonly', 'loading', 'submitting'] as const;

/**
 * 组件的状态类型
 */
export type State = (typeof states)[number];
