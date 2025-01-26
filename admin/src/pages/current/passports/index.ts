// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { PassportComponents } from './passports';
import { Pwd } from './password';
import { TOTP } from './totp';
import { Webauthn } from './webauthn';

export type { PassportComponents } from './passports';

export const components = new Map<string, PassportComponents>([
    ['password', new Pwd('password')],
    ['totp', new TOTP('totp')],
    ['webauthn', new Webauthn('webauthn')],
]);
