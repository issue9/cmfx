// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { AvailableEnumType } from '@components/base';
import { Dropdown as C } from './root';

export const Dropdown = C;

export namespace Dropdown {
	export type MultipleProps<T extends AvailableEnumType = string> = import('./root').DropdownMultipleProps<T>;
	export type SingleProps<T extends AvailableEnumType = string> = import('./root').DropdownSingleProps<T>;
	export type Props<T extends AvailableEnumType = string> = import('./root').DropdownProps<T>;
	export type Ref = import('./root').DropdownRef;
}
