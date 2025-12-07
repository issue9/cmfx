// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { User, Sex, State } from '@/context';

export type Member = {
    id: number;
    nickname: string;
    no: string;
    sex: Sex;
    state: State;

    avatar?: string;
    birthday?: string;
    created?: string;
    passports?: User['passports'];
};
