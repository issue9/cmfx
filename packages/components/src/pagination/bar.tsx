// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, createSignal, JSX, mergeProps } from 'solid-js';

import { BaseProps, joinClass } from '@/base';
import { use, useLocale } from '@/context';
import { Choice, FieldAccessor, FieldOptions } from '@/form';
import { Pagination } from './pagination';
import styles from './style.module.css';

export interface Props extends BaseProps {
    /**
     * 总共的数据量
     */
    total: number;

    /**
     * 当前页的页码，取值范围为 [1, {@link Props#total}/{@link Props#size}]。
     *
     * NOTE: 这是一个非响应式的属性。
     */
    page: number;

    /**
     * 每页的数据条数，默认为 sizes 属性的第二项。
     *
     * NOTE: 该值必须存在于 sizes 中。
     */
    size?: number;

    /**
     * 属性 size 可用值的列表，默认为 {@link Options#api#pageSizes}
     */
    sizes?: Array<number>;

    onPageChange?: { (current: number, old?: number): void };

    onSizeChange?: { (current: number, old?: number): void };

    /**
     * 按钮的数量
     */
    spans?: number;

    class?: string;
}

/**
 * 页码导航条
 *
 * 相对于 {@link Pagination} 变成了按照数据总量进行计算分页，而不是直接按照页数。
 */
export function PaginationBar(props: Props): JSX.Element {
    const [, , opt] = use();
    props = mergeProps({
        total: opt.pageSize,
        spans: 3,
        size: opt.pageSize,
        sizes: opt.pageSizes
    }, props);

    if (props.sizes!.indexOf(props.size!)<0) {
        throw `参数 props.size:${props.size} 必须存在于 props.sizes: ${props.sizes}`;
    }

    const l = useLocale();

    const sizesOptions = createMemo(() => {
        const items: FieldOptions<number> = [];
        props.sizes?.forEach((v) => {
            items.push([v, v]);
        });
        return items;
    });

    const [page, setPage] = createSignal(props.page);

    const sizeAccessor = FieldAccessor('size', props.size!);
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
        const start = props.total > 0 ? ((page() - 1) * sizeAccessor.getValue() + 1) : 0;
        return {
            start: start,
            end: end > props.total ? props.total : end,
            count: props.total
        };
    });

    return <div class={joinClass(props.class, styles.bar, props.palette ? `palette--${props.palette}` : undefined)}>
        {l.t('_c.pagination.items', translateItems())}
        <div class={styles.right}>
            <Choice accessor={sizeAccessor} options={sizesOptions()} />
            <Pagination spans={props.spans} onChange={pageChange} value={props.page} count={pages()} />
        </div>
    </div>;
}
