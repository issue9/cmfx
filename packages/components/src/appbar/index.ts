// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { AppbarBrand, type AppbarBrandProps, type AppbarProps, type AppbarRef, Appbar as C } from './root';

export const Appbar = Object.assign(C, { Brand: AppbarBrand });

export namespace Appbar {
	export type Props = AppbarProps;
	export type Ref = AppbarRef;
	export type ImageProps = AppbarBrandProps;
}
