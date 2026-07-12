// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { ContextNotFoundError, type FetchFunc, type Query } from '@cmfx/core';
import type { Component, JSX, ParentProps, Signal } from 'solid-js';
import { createContext, splitProps, useContext } from 'solid-js';

import type { Form } from '@components/form';
import type { Table } from '@components/table/table';
import type { PreProcessColumn } from './column';

export type FormBuilder<Q extends Query> = (
	api: InstanceType<typeof Form.API<Q>>,
	Field: Component<Form.FieldProps<Q>>,
) => JSX.Element;

// NOTE: 接口比较乱，仅供组件内部使用。
export type Context<T extends object, Q extends Query = Query> = {
	root(): HTMLDivElement;
	table(): HTMLTableElement;
	current: Array<T> | undefined;
	refresh: () => Promise<void>;
	hoverable: Signal<boolean>;
	sticky: Signal<boolean>;
	striped: Signal<Table.Props['striped']>;
	form: ReturnType<typeof Form.create<Q>>;
	total: number;

	// 从 DataTable 组件传递过来的列配置

	columns: Array<PreProcessColumn<T>>;
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
