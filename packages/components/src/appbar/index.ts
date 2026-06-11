// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { AppbarImage, Appbar as C } from './root';

export const Appbar = Object.assign(C, { Image: AppbarImage });

export namespace Appbar {
	export type Props = import('./root').AppbarProps;
	export type Ref = import('./root').AppbarRef;
	export type ImageProps = import('./root').AppbarImageProps;
}
