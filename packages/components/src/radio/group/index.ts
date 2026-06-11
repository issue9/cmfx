// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { AvailableEnumType } from '@components/base';
import { RadioGroup as C } from './root';

export const RadioGroup = C;

export namespace RadioGroup {
	export type Props<T extends AvailableEnumType = string> = import('./root').RadioGroupProps<T>;
	export type Ref = import('./root').RadioGroupRef;
	export type Option<T extends AvailableEnumType = string> = import('./options').RadioGroupOption<T>;
	export type Options<T extends AvailableEnumType = string> = import('./options').RadioGroupOptions<T>;
}
