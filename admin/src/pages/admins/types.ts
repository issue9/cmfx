// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Query as QueryBase } from '@/core';
import { MessagesKey } from '@/messages';

export type Sex = 'male' | 'female' | 'unknown';

export type State = 'normal' | 'locked' | 'deleted';

export const sexesMap: Array<[Sex, MessagesKey]> = [
    ['male', '_i.page.sexes.male'],
    ['female', '_i.page.sexes.female'],
    ['unknown', '_i.page.sexes.unknown'],
] as const;

export const statesMap: Array<[State, MessagesKey]> = [
    ['normal', '_i.page.states.normal'],
    ['locked', '_i.page.states.locked'],
    ['deleted', '_i.page.states.deleted'],
];

export interface Query extends QueryBase {
    text?: string;
    state?: Array<State>;
    sex?: Array<Sex>;
}

export interface Admin {
    id?: number;
    no: string;
    sex: Sex;
    name: string;
    nickname: string;
    avatar?: string;
    created?: string;
    state: State;
    roles: Array<string>;

    username?: string;
    password?: string;
}

export function zeroAdmin(): Admin {
    return {
        id: 0,
        no: '',
        sex: 'unknown',
        name: '',
        nickname: '',
        avatar: '',
        created: '',
        state: 'normal',
        roles: [],

        username: '',
        password: '',
    };
}
