// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { InputBase as C } from './root';

export const InputBase = C;

export namespace InputBase {
	export type AutoComplete = import('./root').InputBaseAutoComplete;
	export type NumberProps = import('./root').InputBaseNumberProps;
	export type TextProps = import('./root').InputBaseTextProps;
	export type Props = import('./root').InputBaseProps;
	export type Ref = import('./root').InputBaseRef;
}
