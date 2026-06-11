// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Root as C } from './root';

export const Table = C;

export namespace Table {
	export type Ref = import('./root').TableRef;
	export type Props = import('./root').TableProps;
}
