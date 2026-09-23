// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { ContextNotFoundError, type FormContext } from '@cmfx/cdk';
import type { FetchFunc, Query } from '@cmfx/core';
import type { Component, JSX, ParentProps, Signal } from 'solid-js';
import { createContext, splitProps, useContext } from 'solid-js';

import type { Form } from '@components/form';
import type { Table } from '@components/table/table';
import type { PreProcessColumn } from './column';

// 生成查询表单的方法
//
// @param api - 操作表单元素的方法；
// @param Field - 表单中单个元素的父元素；
export type FormBuilder<Q extends Query> = (api: FormContext<Q>, Field: Component<Form.FieldProps<Q>>) => JSX.Element;

// NOTE: 接口比较乱，仅供组件内部使用。
export type Context<T extends object, Q extends Query = Query> = {
	root(): HTMLDivElement;
	table(): HTMLTableElement;
	current: Array<T> | undefined; // 当前页的数据
	refresh: () => Promise<void>;
	hoverable: Signal<boolean>;
	sticky: Signal<boolean>;
	striped: Signal<Table.Props['striped']>;
	form: ReturnType<typeof Form.create<Q>>;
	total: number;

	// 从 DataTable 组件传递过来的列配置

	columns: Array<PreProcessColumn<T>>;
	load: FetchFunc<T, Q>;
	queryForm?: FormBuilder<Q>; // 生成表格中的查询表单
	filename?: string;
	systemToolbar?: boolean;
	pageSizes?: Array<number>;
};

const tableContext = createContext<Context<object>>();

export function useTableContext<T extends object, Q extends Query = Query>(): Context<T, Q> {
	const context = useContext(tableContext);
	if (!context) {
		throw new ContextNotFoundError('@cmfx/components.tableContext');
	}
	return context as unknown as Context<T, Q>;
}

export function Provider<T extends object, Q extends Query = Query>(props: ParentProps<Context<T, Q>>): JSX.Element {
	const [, p] = splitProps(props, ['children']);
	return <tableContext.Provider value={p as unknown as Context<object, Query>}>{props.children}</tableContext.Provider>;
}
