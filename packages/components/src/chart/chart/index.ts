// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

export { createChartLocaleLoader } from './locale';

import { Chart as C, presetProps } from './root';

export const Chart = Object.assign(C, {
	presetProps,
});

export namespace Chart {
	export type Props = import('./root').ChartProps;
	export type Ref = import('./root').ChartRef;
	export type Option = import('./root').ChartOption;
}
