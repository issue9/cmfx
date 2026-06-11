// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { MonthView as C } from './root';

export const MonthView = C;

export namespace MonthView {
	export type Props = import('./types').MonthViewProps;
	export type Ref = import('./types').MonthViewRef;
	export type WeekValueType = import('./types').MonthViewWeekValueType;
}
