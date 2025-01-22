// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { PassportComponents } from './passports';
import { Pwd } from './password';
import { TOTP } from './totp';

export type { PassportComponents } from './passports';

export const componens = new Map<string, PassportComponents>([
    ['password', new Pwd()],
    ['totp', new TOTP()],
]);
