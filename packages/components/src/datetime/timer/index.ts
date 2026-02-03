// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type {
	DurationFormat as DF,
	DurationFormatOptions as DFO,
	DurationInput as DI,
} from '../../../node_modules/@formatjs/intl-durationformat/src/types';

// TODO: DurationFormat 上线之后可删除。
// https://caniuse.com/?search=durationformat
// https://github.com/microsoft/TypeScript/issues/60608
declare global {
	namespace Intl {
		type DurationFormat = DF;
		type DurationFormatOptions = DFO;
		type DurationInput = DI;
	}
}

export type { Field as TimerField, Props as TimerProps, Ref as TimerRef } from './timer';
export { default as Timer, fields as timerFields } from './timer';
