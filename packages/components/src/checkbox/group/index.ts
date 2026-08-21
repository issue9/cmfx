// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { CheckboxGroupOption, CheckboxGroupOptions } from './options';
import { CheckboxGroup as C, type CheckboxGroupProps, type CheckboxGroupRef } from './root';

export const CheckboxGroup = C;

export namespace CheckboxGroup {
	export type Props<T extends string | number> = CheckboxGroupProps<T>;
	export type Ref = CheckboxGroupRef;
	export type Option<T extends string | number> = CheckboxGroupOption<T>;
	export type Options<T extends string | number> = CheckboxGroupOptions<T>;
}
