// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { useSearchParams } from '@solidjs/router';
import { createResource, createSignal, JSX, mergeProps, splitProps } from 'solid-js';

import { Palette } from '@/components/base';
import { Button } from '@/components/button';
import { ObjectAccessor } from '@/components/form';
import { PaginationBar } from '@/components/pagination';
import { defaultSizes } from '@/components/pagination/bar';
import { Page } from '@/core';
import type { Props as BaseProps } from './basic';
import { default as BasicTable } from './basic';

/**
 * 从地址的查询参数中获取值
 *
 * @param preset 默认值；
 * @returns 结合 preset 和从地址中获取的参数合并的参数对象
 */
export function fromSearch<Q extends QueryObject>(preset: Q): Q {
    const [ps] = useSearchParams<Q>();
    return Object.assign(preset, ps);
}

/**
 * 将查询参数写入地址中
 *
 * @param q 查询参数
 */
export function saveSearch<Q extends QueryObject>(q: ObjectAccessor<Q>): void {
    const [_, setter] = useSearchParams();
    setter(q.object());
}

/**
 * 查询参数的类型约定
 */
export interface QueryObject {
    // NOTE: 保证查询参数至少且个属性。
    // 如果查询参数为空，表示返回的数据是固定的，
    // 那就和直接拿数据填充 BasicTable 是一样的效果了。
    [k: string]: any;

    // 分页属性，如果存在，那么类型必须得是 number

    page?: number;
    size?: number;
}

export interface Props<T extends object, Q extends QueryObject>
    extends Omit<BaseProps<T>, 'items' | 'extraHeader' | 'extraFooter'> {
    /**
     * 加载数据的方法
     */
    load: { (q: ObjectAccessor<Q>): Promise<Page<T> | Array<T>> };

    //TODO actions?: JSX.Element;

    /**
     * 构建查询参数组件
     */
    queryForm: { (oa: ObjectAccessor<Q>): JSX.Element };

    /**
     * 查询参数的默认值
     */
    queries: Q;

    /**
     * 数据是否分页展示
     *
     * NOTE: 这是一个静态数据，无法在运行过程中改变。
     */
    paging?: boolean;

    /**
     * 分页条所采用的色盘，默认值为 primary
     *
     * NOTE: 只有在 paging 为 true 时才会有效
     */
    paginationPalette?: Palette;

    /**
     * 可用的每页展示数量
     *
     * NOTE: 只有在 paging 为 true 时才会有效
     */
    pageSizes?: Array<number>;
}

const defaultProps = {
    striped: 0,
    pageSize: defaultSizes[1],
    paginationPalette: 'primary' as Palette,
    pageSizes: [...defaultSizes]
};

/**
 * 带有远程加载功能的表格组件
 */
export default function<T extends object, Q extends QueryObject>(props: Props<T, Q>) {
    props = mergeProps(defaultProps, props);
    const oa = new ObjectAccessor<Q>(props.queries);
    const [total, setTotal] = createSignal<number>(100);

    const [items, { refetch }] = createResource(async () => {
        const ret = await props.load(oa);

        if (Array.isArray(ret)) {
            return ret;
        } else {
            setTotal(ret.count);
            return ret.current;
        }
    });

    let footer: JSX.Element | undefined;
    if (props.paging) {
        const page = oa.accessor('page');
        const size = oa.accessor('size');

        footer = <PaginationBar class="mt-2" palette={props.paginationPalette}
            onPageChange={(p) => { page.setValue(p as any); refetch(); }}
            onSizeChange={(s) => { size.setValue(s as any); refetch(); }}
            page={page.getValue()} size={size.getValue()} sizes={props.pageSizes} total={total()} />;
    }

    const header = <div>
        <form>
            {props.queryForm(oa)}
            <Button type='submit' onClick={()=>refetch()}>TODO</Button>
        </form>
    </div>;

    const [_, basicProps] = splitProps(props, ['load', 'queries', 'queryForm', 'paging', 'paginationPalette', 'pageSizes']);
    return <BasicTable items={items()!} {...basicProps} extraFooter={footer} extraHeader={header} />;
}
