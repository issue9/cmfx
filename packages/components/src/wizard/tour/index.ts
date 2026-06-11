// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Tour as C } from './root';

export const Tour = C;

export namespace Tour {
	export type Props = import('./root').TourProps;
	export type Ref = import('./root').TourRef;
	export type Step = import('./root').TourStep;
}
