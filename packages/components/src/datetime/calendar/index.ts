// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Calender as C } from './root';

export const Calendar = C;

export namespace Calendar {
	export type Props = import('./root').CalenderProps;
	export type Ref = import('./root').CalenderRef;
}
