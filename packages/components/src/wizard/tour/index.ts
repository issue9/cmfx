// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Tour as C, type TourProps, type TourRef, type TourStep } from './root';

export const Tour = C;

export namespace Tour {
	export type Props = TourProps;
	export type Ref = TourRef;
	export type Step = TourStep;
}
