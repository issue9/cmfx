// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Stepper as C } from './root';

export const Stepper = C;

export namespace Stepper {
	export type Props = import('./root').StepperProps;
	export type Ref = import('./root').StepperRef;
	export type Step = import('./root').StepperStep;
}
