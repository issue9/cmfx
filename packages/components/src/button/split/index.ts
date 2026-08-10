// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { AvailableEnumType } from '@cmfx/cdk';

import {
	SplitButton as C,
	presetProps,
	type SplitButtonMultipleProps,
	type SplitButtonProps,
	type SplitButtonSingleProps,
} from './root';

export const SplitButton = Object.assign(C, { presetProps });

export namespace SplitButton {
	export type SingleProps<T extends AvailableEnumType = string> = SplitButtonSingleProps<T>;
	export type MultipleProps<T extends AvailableEnumType = string> = SplitButtonMultipleProps<T>;
	export type Props<T extends AvailableEnumType = string> = SplitButtonProps<T>;
	export type Ref = import('./root').SplitButtonRef;
}
