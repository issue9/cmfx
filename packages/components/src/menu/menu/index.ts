// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { AvailableEnumType } from '@components/base';
import { Menu as C, type MenuTag } from './root';

export const Menu = C;

export namespace Menu {
	export type MultipleProps<
		T extends AvailableEnumType = string,
		TAG extends MenuTag = 'menu',
	> = import('./root').MenuMultipleProps<T, TAG>;

	export type SingleProps<
		T extends AvailableEnumType = string,
		TAG extends MenuTag = 'menu',
	> = import('./root').MenuSingleProps<T, TAG>;

	export type Props<T extends AvailableEnumType = string, TAG extends MenuTag = 'menu'> = import('./root').MenuProps<
		T,
		TAG
	>;
	export type Ref<TAG extends MenuTag = 'menu'> = import('./root').MenuRef<TAG>;

	export type Divider = import('./item').MenuDivider;
	export type Group<T extends AvailableEnumType = string> = import('./item').MenuGroup<T>;
	export type Item<T extends AvailableEnumType = string> = import('./item').MenuItem<T>;
	export type MenuItem<T extends AvailableEnumType = string> = import('./item').MenuMenuItem<T>;
}
