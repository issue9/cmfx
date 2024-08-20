// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { SetParams } from '@solidjs/router';
import { createResource, createSignal, JSX, mergeProps, splitProps } from 'solid-js';

import { useApp } from '@/app';
import { Palette } from '@/components/base';
import { Button } from '@/components/button';
import { ObjectAccessor } from '@/components/form';
import { PaginationBar } from '@/components/pagination';
import { defaultSizes } from '@/components/pagination/bar';
import { Page } from '@/core';
import type { Props as BaseProps } from './basic';
import { default as BasicTable } from './basic';

export interface Props<T extends object, Q extends SetParams>
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
     * 一些突出元素的主题色，默认值为 primary。
     */
    accentPalette?: Palette;

    /**
     * 数据是否分页展示
     *
     * NOTE: 这是一个静态数据，无法在运行过程中改变。
     */
    paging?: boolean;

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
    accentPalette: 'primary' as Palette,
    pageSizes: [...defaultSizes]
};

/**
 * 带有远程加载功能的表格组件
 *
 * T 为数据中每一条数据的类型；
 * Q 为查询参数的类型；
 */
export default function<T extends object, Q extends SetParams>(props: Props<T, Q>) {
    const ctx = useApp();
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
        const page = oa.accessor<number>('page');
        const size = oa.accessor<number>('size');

        footer = <PaginationBar class="mt-2" palette={props.accentPalette}
            onPageChange={(p) => { page.setValue(p); refetch(); }}
            onSizeChange={(s) => { size.setValue(s); refetch(); }}
            page={page.getValue()} size={size.getValue()} sizes={props.pageSizes} total={total()} />;
    }

    const header = <header class="header">
        <form class="search">
            {props.queryForm(oa)}
            <div class="actions">
                <Button disabled={oa.isPreset()} type='reset' onClick={() => oa.reset()}>{ctx.t('_internal.reset')}</Button>
                <Button palette='primary' disabled={oa.isPreset()} type='submit' onClick={() => refetch()}>{ctx.t('_internal.search')}</Button>
            </div>
        </form>

        <div class="toolbar">
        </div>
    </header>;

    const [_, basicProps] = splitProps(props, ['load', 'queries', 'queryForm', 'paging', 'accentPalette', 'pageSizes']);
    return <BasicTable items={items()!} {...basicProps} extraFooter={footer} extraHeader={header} />;
}
