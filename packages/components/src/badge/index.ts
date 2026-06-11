// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { badgeCorners, Badge as C } from './root';

export const Badge = Object.assign(C, { corners: badgeCorners });

export namespace Badge {
	export type Props = import('./root').BadgeProps;
	export type Ref = import('./root').BadgeRef;
	export type Corner = import('./root').BadgeCorner;
}
