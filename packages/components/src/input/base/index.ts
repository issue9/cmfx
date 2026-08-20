// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type {
	InputBaseAutoComplete,
	InputBaseNumberProps,
	InputBaseProps,
	InputBaseRef,
	InputBaseTextProps,
} from './root';
import { InputBase as C } from './root';

export const InputBase = C;

export namespace InputBase {
	export type AutoComplete = InputBaseAutoComplete;
	export type NumberProps = InputBaseNumberProps;
	export type TextProps = InputBaseTextProps;
	export type Props = InputBaseProps;
	export type Ref = InputBaseRef;
}
