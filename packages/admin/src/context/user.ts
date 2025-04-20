// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 用户的基本信息
 */
export interface User {
    id?: number;
    sex: 'male' | 'female' | 'unknown';
    state: 'normal' | 'locked' | 'deleted';
    name: string;
    nickname: string;
    avatar?: string;
    roles?: Array<string>;
    passports?: Array<Passport>;
}

interface Passport {
    id: string;
    identity: string;
}
