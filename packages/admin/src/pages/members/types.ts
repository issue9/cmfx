// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { user } from '@/components';
import { User } from '@/context';

export interface Member {
    id: number;
    nickname: string;
    no: string;
    sex: user.Sex;
    state: user.State;
    
    avatar?: string;
    birthday?: string;
    created?: string;
    passports?: User['passports'];
}