// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 用户的基本信息
 */
export interface User {
    id?: number;
    sex?: 'unknown' | 'male' | 'female';
    name?: string;
    nickname?: string;
    avatar?: string;
}
