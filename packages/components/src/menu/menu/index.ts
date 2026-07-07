// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { AvailableEnumType } from '@components/base';
import type { MenuItem, MenuItemDivider, MenuItemGroup, MenuItemItem, MenuItemItems } from './item';
import type { MenuMultipleProps, MenuProps, MenuRef, MenuSingleProps } from './root';
import { Menu as C, type MenuTag } from './root';

export const Menu = C;

export namespace Menu {
	export type MultipleProps<T extends AvailableEnumType = string, TAG extends MenuTag = 'menu'> = MenuMultipleProps<
		T,
		TAG
	>;

	export type SingleProps<T extends AvailableEnumType = string, TAG extends MenuTag = 'menu'> = MenuSingleProps<T, TAG>;

	export type Props<T extends AvailableEnumType = string, TAG extends MenuTag = 'menu'> = MenuProps<T, TAG>;
	export type Ref<TAG extends MenuTag = 'menu'> = MenuRef<TAG>;

	export type ItemDivider = MenuItemDivider;
	export type ItemGroup<T extends AvailableEnumType = string> = MenuItemGroup<T>;
	export type ItemItem<T extends AvailableEnumType = string> = MenuItemItem<T>;
	export type ItemItems<T extends AvailableEnumType = string> = MenuItemItems<T>;
	export type Item<T extends AvailableEnumType = string> = MenuItem<T>;
}
