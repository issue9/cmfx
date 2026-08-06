// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { AvailableEnumType } from '@components/base';
import {
	Dropdown as C,
	type DropdownMultipleProps,
	type DropdownProps,
	type DropdownRef,
	type DropdownSingleProps,
} from './root';

export const Dropdown = C;

export namespace Dropdown {
	export type MultipleProps<T extends AvailableEnumType = string> = DropdownMultipleProps<T>;
	export type SingleProps<T extends AvailableEnumType = string> = DropdownSingleProps<T>;
	export type Props<T extends AvailableEnumType = string> = DropdownProps<T>;
	export type Ref = DropdownRef;
}
