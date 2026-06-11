// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Card as C } from './root';

export const Card = C;

export namespace Card {
	export type Props = import('./root').CardProps;
	export type Ref = import('./root').CardRef;
}
