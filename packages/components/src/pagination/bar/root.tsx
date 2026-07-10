// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { joinClass, type ThemeProps } from '@cmfx/themes';
import { createMemo, createSignal, type JSX, mergeProps } from 'solid-js';

import type { BaseRef, ChangeFunc, RefProps } from '@components/base';
import { PropsError } from '@components/base';
import { useLocale, useOptions } from '@components/context';
import { Choice } from '@components/menu';
import { Pagination } from '@components/pagination/pagination';
import styles from './style.module.css';

export interface PaginationBarRef extends BaseRef<HTMLDivElement> {
	/**
	 * 跳转到指定的页面
	 *
	 * @param p 页码；
	 */
	jump(p: number): void;
}

export interface PaginationBarProps extends ThemeProps, RefProps<PaginationBarRef> {
	/**
	 * 总共的数据量
	 *
	 * @remarks
	 * NOTE: 必须是一个大于零的整数，否则会导致导航条显示错误。
	 *
	 * @reactive
	 */
	total: number;

	/**
	 * 当前页的页码，取值范围为 [1, {@link total}/{@link size}]。
	 */
	readonly page: number;

	/**
	 * 每页的数据条数，默认为 sizes 属性的第二项。
	 */
	readonly size?: number;

	/**
	 * 属性 size 可用值的列表
	 *
	 * @defaultValue Options.api.pageSizes
	 */
	readonly sizes?: Array<number>;

	readonly onPageChange?: ChangeFunc<number>;

	readonly onSizeChange?: ChangeFunc<number>;

	/**
	 * 按钮的数量
	 *
	 * @reactive
	 */
	spans?: number;
}

/**
 * 页码导航条
 *
 * 相对于 {@link Pagination} 变成了按照数据总量进行计算分页，而不是直接按照页数。
 */
export function PaginationBar(props: PaginationBarProps): JSX.Element {
	const [, opt] = useOptions();
	props = mergeProps(
		{
			total: opt.pageSize,
			spans: 3,
			size: opt.pageSize,
			sizes: opt.pageSizes,
		},
		props,
	);

	if (!props.sizes!.includes(props.size!)) {
		throw new PropsError('size', `${props.size} 必须存在于 props.sizes: ${props.sizes}`);
	}

	const l = useLocale();

	const sizesOptions = createMemo(() => {
		return props.sizes!.map(v => {
			// 由 opt 保证 props.sizes 不为空
			return { type: 'item', value: v, label: v.toString() } as Choice.Option<number>;
		});
	});

	const [page, setPage] = createSignal(props.page);
	const [size, setSize] = createSignal(props.size!);

	// 页码数量
	const pages = createMemo(() => {
		return Math.ceil(props.total / size());
	});

	const pageChange = (val: number, old?: number) => {
		if (props.onPageChange) {
			props.onPageChange(val, old);
		}
		setPage(val);
	};

	const sizeChange = (val?: number, old?: number) => {
		if (val === undefined) {
			return;
		}

		if (props.onSizeChange) {
			props.onSizeChange(val, old);
		}

		setSize(val);
	};

	const translateItems = createMemo(() => {
		const end = page() * size();
		const start = props.total > 0 ? (page() - 1) * size() + 1 : 0;
		return {
			start: start,
			end: end > props.total ? props.total : end,
			count: props.total,
		};
	});

	let rootRef: HTMLDivElement;
	return (
		<div ref={el => (rootRef = el)} class={joinClass(props.palette, styles.bar, props.class)} style={props.style}>
			<div class={styles.start}>
				{l.t('_c.pagination.items', translateItems())}
				<Choice value={size()} onChange={v => sizeChange(v)} options={sizesOptions()} />
			</div>
			<Pagination
				class={styles.end}
				spans={props.spans}
				onChange={pageChange}
				value={page()}
				count={pages()}
				ref={el => {
					if (props.ref) {
						props.ref({
							root: () => rootRef,
							jump: el.jump,
						});
					}
				}}
			/>
		</div>
	);
}
