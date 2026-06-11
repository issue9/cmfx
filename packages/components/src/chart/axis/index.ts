// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { ChartAxisRoot as C } from './root';

export const ChartAxis = C;

export namespace ChartAxis {
	export type Props<T extends object> = import('./root').ChartAxisProps<T>;
	export type Ref<T extends object> = import('./root').ChartAxisRef<T>;
	export type Series<T extends object> = import('./root').ChartAxisSeries<T>;
	export type XAxis<T extends object> = import('./root').ChartAxisXAxis<T>;
}
