// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

export { createChartLocaleLoader } from './locale';

import { Chart as C, type ChartOption, type ChartProps, type ChartRef, presetProps } from './root';

export const Chart = Object.assign(C, {
	presetProps,
});

export namespace Chart {
	export type Props = ChartProps;
	export type Ref = ChartRef;
	export type Option = ChartOption;
}
