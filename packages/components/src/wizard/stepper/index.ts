// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Stepper as C, type StepperProps, type StepperRef, type StepperStep } from './root';

export const Stepper = C;

export namespace Stepper {
	export type Props = StepperProps;
	export type Ref = StepperRef;
	export type Step = StepperStep;
}
