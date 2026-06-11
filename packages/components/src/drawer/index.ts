// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Drawer as C, ToggleButton } from './root';

export const Drawer = Object.assign(C, { ToggleButton });

export namespace Drawer {
	export type Props = import('./root').DrawerProps;
	export type Ref = import('./root').DrawerRef;
	export type ToggleButtonProps = import('./root').DrawerToggleButtonProps;
}
