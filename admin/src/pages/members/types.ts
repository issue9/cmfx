// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { User } from '@/app/context';
import { Sex, State } from '@/pages/common';

export interface Member {
    id: number;
    nickname: string;
    no: string;
    sex: Sex;
    state: State;
    
    avatar?: string;
    birtday?: string;
    created?: string;
    passports?: Array<User['passports']>;
}