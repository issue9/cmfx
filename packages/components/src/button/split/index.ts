// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { AvailableEnumType } from '@components/base';
import { SplitButton as C, presetProps } from './root';

export const SplitButton = Object.assign(C, { presetProps });

export namespace SplitButton {
	export type SingleProps<T extends AvailableEnumType = string> = import('./root').SplitButtonSingleProps<T>;
	export type MultipleProps<T extends AvailableEnumType = string> = import('./root').SplitButtonMultipleProps<T>;
	export type Props<T extends AvailableEnumType = string> = import('./root').SplitButtonProps<T>;
	export type Ref = import('./root').SplitButtonRef;
}
