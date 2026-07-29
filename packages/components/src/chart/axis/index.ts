// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { ChartAxisProps, ChartAxisRef, ChartAxisSeries, ChartAxisXAxis } from './root';
import { ChartAxisRoot as C } from './root';

export const ChartAxis = C;

export namespace ChartAxis {
	export type Props<T extends object> = ChartAxisProps<T>;
	export type Ref<T extends object> = ChartAxisRef<T>;
	export type Series<T extends object> = ChartAxisSeries<T>;
	export type XAxis<T extends object> = ChartAxisXAxis<T>;
}
