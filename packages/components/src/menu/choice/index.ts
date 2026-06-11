// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { AvailableEnumType } from '@components/base';
import { Choice as C } from './root';

export const Choice = C;

export namespace Choice {
	export type MultipleProps<T extends AvailableEnumType = string> = import('./root').ChoiceMultipleProps<T>;
	export type SingleProps<T extends AvailableEnumType = string> = import('./root').ChoiceSingleProps<T>;
	export type Option<T extends AvailableEnumType = string> = import('./root').ChoiceOption<T>;
	export type Options<T extends AvailableEnumType = string> = import('./root').ChoiceOptions<T>;
	export type Props<T extends AvailableEnumType = string> = import('./root').ChoiceProps<T>;
	export type Ref = import('./root').ChoiceRef;
}
