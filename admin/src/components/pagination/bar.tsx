// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, createSignal, mergeProps } from 'solid-js';

import { useApp } from '@/app';
import { BaseProps } from '@/components/base';
import { Choice, FieldAccessor, Options } from '@/components/form';
import { default as Pagination } from './pagination';

export interface Props extends BaseProps {
    /**
     * 总共的数据量
     */
    total: number;

    /**
     * 当前页的页码，取值范围为 [1, Props#total/Props#size]。
     */
    page: number;

    /**
     * 每页的数据条数
     *
     * NOTE: 该值必须存在于 sizes 中。
     */
    size: number;

    /**
     * 属性 size 可用值的列表
     */
    sizes?: Array<number>;

    onPageChange?: { (current: number, old?: number): void };

    onSizeChange?: { (current: number, old?: number): void };

    /**
     * 按钮的数量
     */
    spans?: number;
}

const defaultProps: Readonly<Partial<Props>> = {
    spans: 3,
    sizes: [10, 20, 50, 100]
};

/**
 * 页码导航条
 *
 * 相对于 {@link Pagination} 变成了按照数据总量进行计算分页，而不是直接按照页数。
 */
export default function(props: Props) {
    props = mergeProps(defaultProps, props);
    if (props.sizes!.indexOf(props.size)<0) {
        throw `参数 size:${props.size} 必须存在于 props.sizes`;
    }

    const ctx = useApp();

    const sizesOptions = createMemo(() => {
        const items: Options<number> = [];
        props.sizes?.forEach((v) => {
            items.push([v, v]);
        });
        return items;
    });

    const [page, setPage] = createSignal(props.page);

    const sizeAccessor = FieldAccessor('size', props.size);
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
        return {
            start: (page() - 1) * sizeAccessor.getValue() + 1,
            end: page() * sizeAccessor.getValue(),
            count: props.total
        };
    });

    return <div classList={{
        'c--pagination-bar': true,
        [`palette--${props.palette}`]: !!props.palette
    }}>
        {ctx.t('_internal.pagination.items', translateItems())}
        <div class="flex gap-2">
            <Choice accessor={sizeAccessor} options={sizesOptions()} />
            <Pagination spans={props.spans} onChange={pageChange} value={page()} count={pages()} />
        </div>
    </div>;
}
