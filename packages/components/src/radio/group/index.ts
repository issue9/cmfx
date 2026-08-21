// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { AvailableEnumType } from '@cmfx/cdk';

import type { RadioGroupOption, RadioGroupOptions } from './options';
import { RadioGroup as C, type RadioGroupProps, type RadioGroupRef } from './root';

export const RadioGroup = C;

export namespace RadioGroup {
	export type Props<T extends AvailableEnumType = string> = RadioGroupProps<T>;
	export type Ref = RadioGroupRef;
	export type Option<T extends AvailableEnumType = string> = RadioGroupOption<T>;
	export type Options<T extends AvailableEnumType = string> = RadioGroupOptions<T>;
}
