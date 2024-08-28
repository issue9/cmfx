// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { AppContext } from '@/app';
import { Options, Query as QueryBase } from '@/components';

export type Sex = 'male' | 'female' | 'unknown';

export type State = 'normal' | 'locked' | 'deleted';

export function buildSexOptions(ctx: AppContext): Options<Sex> {
    return [
        ['male', ctx.t('_i.page.sexes.male')],
        ['female', ctx.t('_i.page.sexes.female')],
        ['unknown', ctx.t('_i.page.sexes.unknown')],
    ] as const;
}

export function buildStateOptions(ctx: AppContext): Options<State> {
    return [
        ['normal', ctx.t('_i.page.states.normal')],
        ['locked', ctx.t('_i.page.states.locked')],
        ['deleted', ctx.t('_i.page.states.deleted')],
    ] as const;
}

export interface Query extends QueryBase {
    text?: string;
    states?: Array<State>;
    sexes?: Array<Sex>;
}

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
