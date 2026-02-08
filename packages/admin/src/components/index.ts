// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

export type { SexSelectorProps } from './sex';
export { localeSexes, SexSelector } from './sex';
export type { StateSelectorProps } from './state';
export { localeStates, StateSelector } from './state';

export interface Passport {
	id: string;
	desc: string;
}
