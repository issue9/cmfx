// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Query } from '@cmfx/core';

import { selectionColumn } from './column';
import { buildRESTLoad } from './rest';
import { Root as C } from './table';

export const DataTable = Object.assign(C, {
	selectionColumn,
	buildRESTLoad,
});

export namespace DataTable {
	export type Column<T extends object> = import('./column').DataTableColumn<T>;
	export type Props<T extends object, Q extends Query> = import('./table').DataTableProps<T, Q>;
	export type Ref = import('./table').DataTableRef;
	export type SearchConverter<Q extends Query> = import('./table').DataTableSearchConverter<Q>;
	export type SearchParams<Q extends Query> = import('./table').DataTableSearchParams<Q>;
}
