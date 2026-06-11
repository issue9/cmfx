// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Counter as C } from './root';

export const Counter = C;

export namespace Counter {
	export type Props = import('./root').CounterProps;
	export type Ref = import('./root').CounterRef;
}
