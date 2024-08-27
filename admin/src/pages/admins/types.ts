// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

export type Sex = 'male' | 'female' | 'unknown';

export type State = 'normal' | 'locked' | 'deleted';

export interface Admin {
    id: number;
    no: string;
    sex: Sex;
    name: string;
    nickname: string;
    avatar?: string;
    created: string;
    state: State;
}
