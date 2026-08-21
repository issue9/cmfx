// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { AvailableEnumType } from '@cmfx/cdk';

import type {
	ChoiceMultipleProps,
	ChoiceOption,
	ChoiceOptions,
	ChoiceProps,
	ChoiceRef,
	ChoiceSingleProps,
} from './root';
import { Choice as C } from './root';

export const Choice = C;

export namespace Choice {
	export type MultipleProps<T extends AvailableEnumType = string> = ChoiceMultipleProps<T>;
	export type SingleProps<T extends AvailableEnumType = string> = ChoiceSingleProps<T>;
	export type Option<T extends AvailableEnumType = string> = ChoiceOption<T>;
	export type Options<T extends AvailableEnumType = string> = ChoiceOptions<T>;
	export type Props<T extends AvailableEnumType = string> = ChoiceProps<T>;
	export type Ref = ChoiceRef;
}
