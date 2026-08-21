// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { DateRangePicker as C, type DateRangePickerProps, type DateRangePickerRef } from './root';
import type { DateRangeValueType } from './shortcuts';

export const DateRangePicker = C;

export namespace DateRangePicker {
	export type Props = DateRangePickerProps;
	export type Ref = DateRangePickerRef;
	export type ValueType = DateRangeValueType;
}
