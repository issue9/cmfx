// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

export { states, StateSelector } from './state';
export type { State, StateSelectorProps } from './state';

export { sexes, SexSelector } from './sex';
export type { Sex, SexSelectorProps } from './sex';

export interface Passport {
    id: string;
    desc: string;
}
