// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { FetchFunc, Query } from '@cmfx/core';
import type { Component, JSX, ParentProps, Signal } from 'solid-js';
import { createContext, splitProps, useContext } from 'solid-js';

import { ContextNotFoundError } from '@components/context';
import type { Form } from '@components/form';
import type { Table } from '@components/table/table';
import type { Column } from './column';

export type FormBuilder<Q extends Query> = (api: Form.API<Q>, Field: Component<Form.FieldProps<Q>>) => JSX.Element;

export type Context<T extends object, Q extends Query = Query> = {
	root(): HTMLDivElement;
	table(): HTMLTableElement;
	current: Array<T> | undefined;
	refresh: () => Promise<void>;
	hoverable: Signal<boolean>;
	sticky: Signal<boolean>;
	striped: Signal<Table.RootProps['striped']>;
	form: ReturnType<typeof Form.create<Q>>;
	total: number;
	columns: Array<Column<T>>;
	load: FetchFunc<T, Q>;
	queryForm?: FormBuilder<Q>;
	filename?: string;
	systemToolbar?: boolean;
	pageSizes?: Array<number>;
};

const tableContext = createContext<Context<object>>();

export function useTableContext<T extends object, Q extends Query = Query>(): Context<T, Q> {
	const context = useContext(tableContext);
	if (!context) {
		throw new ContextNotFoundError('tableContext');
	}
	return context as unknown as Context<T, Q>;
}

export function Provider<T extends object, Q extends Query = Query>(props: ParentProps<Context<T, Q>>): JSX.Element {
	const [, p] = splitProps(props, ['children']);
	return <tableContext.Provider value={p as unknown as Context<object, Query>}>{props.children}</tableContext.Provider>;
}
