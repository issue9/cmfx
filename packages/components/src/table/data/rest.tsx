// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type Query, query2Search, type REST } from '@cmfx/core';
import { type Component, mergeProps, splitProps } from 'solid-js';
import IconDelete from '~icons/material-symbols/delete';

import type { OnProblem } from '@components/base';
import { ConfirmButton } from '@components/button';
import { useLocale } from '@components/context';
import { useTableContext } from './context';
import type { NoPagingProps, PagingProps } from './table';

export interface DataTableDeleteButtonProps extends Omit<ConfirmButton.NormalProps, 'onclick'> {
	id: string | number;
}

type Loader<T extends object, Q extends Query, P extends boolean = true> = P extends true
	? PagingProps<T, Q>['load']
	: NoPagingProps<T, Q>['load'];

/**
 * 根据 {@link REST} 接口实现从远程加载的方法和删除按钮
 *
 * @typeParam T - 数据类型；
 * @typeParam Q - 查询参数类型；
 * @typeParam P - 是否启用分页的标志；
 * @returns 一个包含加载数据和删除按钮的数组。
 * - `load`：加载数据的方法，是基于 path 参数作 get 操作。
 * - `del`：删除按钮的组件，是基于 path 和 id 作 delete 操作。
 */
export function buildREST<T extends object, Q extends Query = Query, P extends boolean = true>(
	rest: REST,
	path: string,
	onProblem?: OnProblem,
): [load: Loader<T, Q, P>, del: Component<DataTableDeleteButtonProps>] {
	const load: Loader<T, Q, P> = async q => {
		const ret = await rest.get(path + query2Search(q));
		if (!ret.ok) {
			if (ret.status !== 404 && onProblem) {
				await onProblem(ret.body);
			}
			return undefined;
		}
		return ret.body;
	};

	const del: Component<DataTableDeleteButtonProps> = props => {
		const l = useLocale();
		const ctx = useTableContext();

		props = mergeProps(
			{
				prompt: l.t('_c.data.areYouSureDeleteThisRow'),
			},
			props,
		);

		const [, p] = splitProps(props, ['children']);
		return (
			<ConfirmButton
				{...p}
				onclick={async () => {
					const ret = await rest.delete(`${path}/${props.id}`);
					if (ret.ok) {
						if (ctx) {
							await ctx.refresh();
						}
						return;
					}

					if (onProblem) {
						await onProblem(ret.body);
					}
				}}
			>
				{props.children ?? <IconDelete />}
			</ConfirmButton>
		);
	};

	return [load, del];
}
