// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { BadgeCorner, BadgeProps, BadgeRef } from './root';
import { badgeCorners, Badge as C } from './root';

export const Badge = Object.assign(C, { corners: badgeCorners });

export namespace Badge {
	export type Props = BadgeProps;
	export type Ref = BadgeRef;
	export type Corner = BadgeCorner;
}
