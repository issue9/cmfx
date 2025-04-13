// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { User } from '@/components';
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