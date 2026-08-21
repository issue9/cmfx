// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { MonthView as C } from './root';
import type { MonthViewProps, MonthViewRef, MonthViewWeekValueType } from './types';

export const MonthView = C;

export namespace MonthView {
	export type Props = MonthViewProps;
	export type Ref = MonthViewRef;
	export type WeekValueType = MonthViewWeekValueType;
}
