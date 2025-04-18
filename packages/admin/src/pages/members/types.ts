// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { User } from '@admin/context';
import { Sex, State } from '@admin/pages/common';

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