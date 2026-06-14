// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Query } from '@cmfx/core';

import { selectionColumn } from './column';
import { buildREST, type DataTableDeleteButtonProps } from './rest';
import type { DataTableProps, DataTableRef, DataTableSearchConverter, DataTableSearchParams } from './table';
import { DataTable as C } from './table';

export const DataTable = Object.assign(C, {
	selectionColumn,
	buildREST,
});

export namespace DataTable {
	export type Column<T extends object> = import('./column').DataTableColumn<T>;
	export type Props<T extends object, Q extends Query> = DataTableProps<T, Q>;
	export type Ref<T extends object> = DataTableRef<T>;
	export type SearchConverter<Q extends Query> = DataTableSearchConverter<Q>;
	export type SearchParams<Q extends Query> = DataTableSearchParams<Q>;
	export type DeleteButtonProps = DataTableDeleteButtonProps;
}
