// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { CheckboxGroup as C } from './root';

export const CheckboxGroup = C;

export namespace CheckboxGroup {
	export type Props<T extends string | number> = import('./root').CheckboxGroupProps<T>;
	export type Ref = import('./root').CheckboxGroupRef;
	export type Option<T extends string | number> = import('./options').CheckboxGroupOption<T>;
	export type Options<T extends string | number> = import('./options').CheckboxGroupOptions<T>;
}
