// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Drawer as C, type DrawerProps, type DrawerRef, type DrawerToggleButtonProps, ToggleButton } from './root';

export const Drawer = Object.assign(C, { ToggleButton });

export namespace Drawer {
	export type Props = DrawerProps;
	export type Ref = DrawerRef;
	export type ToggleButtonProps = DrawerToggleButtonProps;
}
