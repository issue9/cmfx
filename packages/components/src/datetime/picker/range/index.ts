// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { DateRangePicker as C } from './root';

export const DateRangePicker = C;

export namespace DateRangePicker {
	export type Props = import('./root').DateRangePickerProps;
	export type Ref = import('./root').DateRangePickerRef;
	export type ValueType = import('./shortcuts').DateRangeValueType;
}
