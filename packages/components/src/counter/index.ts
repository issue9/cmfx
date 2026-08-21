// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Counter as C, type CounterProps, type CounterRef } from './root';

export const Counter = C;

export namespace Counter {
	export type Props = CounterProps;
	export type Ref = CounterRef;
}
