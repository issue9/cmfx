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
    birthday?: string;
    created?: string;
    passports?: User['passports'];
}