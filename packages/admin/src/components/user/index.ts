// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

export { localeStates, StateSelector } from './state';
export type { StateSelectorProps } from './state';

export { localeSexes, SexSelector } from './sex';
export type { SexSelectorProps } from './sex';

export interface Passport {
    id: string;
    desc: string;
}
