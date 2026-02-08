// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, createSignal, JSX, mergeProps } from 'solid-js';

import { BaseProps, joinClass, PropsError } from '@components/base';
import { useLocale, useOptions } from '@components/context';
import { Choice, ChoiceOption, fieldAccessor } from '@components/form';
import { Pagination } from './pagination';
import styles from './style.module.css';

export interface Props extends BaseProps {
	/**
	 * 总共的数据量
	 *
	 * @reactive
	 */
	total: number;

	/**
	 * 当前页的页码，取值范围为 [1, {@link Props#total}/{@link Props#size}]。
	 */
	page: number;

	/**
	 * 每页的数据条数，默认为 sizes 属性的第二项。
	 */
	size?: number;

	/**
	 * 属性 size 可用值的列表，默认为 {@link Options#api.pageSizes}
	 */
	sizes?: Array<number>;

	onPageChange?: (current: number, old?: number) => void;

	onSizeChange?: (current: number, old?: number) => void;

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
export function PaginationBar(props: Props): JSX.Element {
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

	if (props.sizes!.indexOf(props.size!) < 0) {
		throw new PropsError('size', `必须存在于 props.sizes: ${props.sizes}`);
	}

	const l = useLocale();

	const sizesOptions = createMemo(() => {
		return props.sizes!.map(v => {
			// 由 opt 保证 props.sizes 不为空
			return { type: 'item', value: v, label: v.toString() } as ChoiceOption<number>;
		});
	});

	const [page, setPage] = createSignal(props.page);

	const sizeAccessor = fieldAccessor('size', props.size!);
	sizeAccessor.onChange((val: number, old?: number) => {
		if (page() >= pages()) {
			pageChange(pages(), page());
		}

		if (props.onSizeChange) {
			props.onSizeChange(val, old);
		}
	});

	// 页码数量
	const pages = createMemo(() => {
		return Math.ceil(props.total / sizeAccessor.getValue());
	});

	const pageChange = (val: number, old?: number) => {
		if (props.onPageChange) {
			props.onPageChange(val, old);
		}
		setPage(val);
	};

	const translateItems = createMemo(() => {
		const end = page() * sizeAccessor.getValue();
		const start = props.total > 0 ? (page() - 1) * sizeAccessor.getValue() + 1 : 0;
		return {
			start: start,
			end: end > props.total ? props.total : end,
			count: props.total,
		};
	});

	return (
		<div class={joinClass(props.palette, styles.bar, props.class)} style={props.style}>
			{l.t('_c.pagination.items', translateItems())}
			<div class={styles.right}>
				<Choice accessor={sizeAccessor} options={sizesOptions()} />
				<Pagination spans={props.spans} onChange={pageChange} initValue={props.page} count={pages()} />
			</div>
		</div>
	);
}
