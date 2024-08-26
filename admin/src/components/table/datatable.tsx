// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { SetParams } from '@solidjs/router';
import { createResource, createSignal, JSX, mergeProps, Show, splitProps } from 'solid-js';

import { useApp } from '@/app';
import { Palette } from '@/components/base';
import { Button, SplitButton } from '@/components/button';
import { Divider } from '@/components/divider';
import { ObjectAccessor } from '@/components/form';
import { PaginationBar } from '@/components/pagination';
import { defaultSizes } from '@/components/pagination/bar';
import { Exporter, Page } from '@/core';
import type { Props as BaseProps } from './basic';
import { default as BasicTable } from './basic';

export interface Props<T extends object, Q extends SetParams>
    extends Omit<BaseProps<T>, 'items' | 'extraHeader' | 'extraFooter'> {

    /**
     * 文件名
     */
    filename?: string;

    /**
     * 加载数据的方法
     */
    load: { (q: Q): Promise<Page<T> | Array<T> | undefined> };

    /**
     * 构建查询参数组件
     *
     * 可以为空，可能存在只有分页的情况。
     */
    queryForm?: { (oa: ObjectAccessor<Q>): JSX.Element };

    /**
     * 查询参数的默认值
     *
     * 如果没有查询参数可以使用 {} 代替。
     */
    queries: Q;

    /**
     * 工具栏的内容
     *
     * 此属性提供的内容显示在左侧部分。工具栏右侧部分为框架自身提供的功能。
     */
    toolbar?: JSX.Element;

    /**
     * 是否需要展示框架自身提供的工具栏功能
     */
    systemToolbar?: boolean;

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
    filename: 'download',
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
        const ret = await props.load(oa.object());

        if (ret === undefined) {
            return undefined;
        }else if (Array.isArray(ret)) {
            return ret;
        } else {
            setTotal(ret.count);
            return ret.current;
        }
    });

    const exportCSV = async function (ext: Parameters<Exporter<T>['export']>[1]) {
        const e = new Exporter(props.columns);
        const q = { ...oa.object() };
        delete q.size;
        delete q.page;

        await e.download(()=>{
            return props.load(q);
        });
        e.export(props.filename!, ext);
    };

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
        <Show when={props.queryForm}>
            <form class="search">
                {props.queryForm!(oa)}
                <div class="actions">
                    <Button disabled={oa.isPreset()} type='reset' onClick={() => oa.reset()}>{ctx.t('_internal.reset')}</Button>
                    <SplitButton palette='primary' type='submit' onClick={() => refetch()} menus={[
                        { type: 'item', label: ctx.t('_internal.table.exportTo', {type:'CSV'}), onClick: () => { exportCSV('.csv'); }},
                        { type: 'item', label: ctx.t('_internal.table.exportTo', {type: 'xlsx'}), onClick: () => { exportCSV('.xlsx'); }},
                        { type: 'item', label: ctx.t('_internal.table.exportTo', {type:'ods'}), onClick: () => { exportCSV('.ods'); }},
                    ]}>
                        {ctx.t('_internal.search')}
                    </SplitButton>
                </div>
            </form>
        </Show>

        <Show when={props.queryForm && (props.toolbar || props.systemToolbar)}>
            <Divider padding="8px" />
        </Show>

        <Show when={props.toolbar || props.systemToolbar}>
            <div class="toolbar">
                {props.toolbar}
                <Show when={props.systemToolbar}>
                    <button onClick={() => refetch()}
                        class="c--icon tail action"
                        aria-label={ctx.t('_internal.refresh')}
                        title={ctx.t('_internal.refresh')}>refresh</button>
                </Show>
            </div>
        </Show>
    </header>;

    const [_, basicProps] = splitProps(props, ['load', 'queries', 'queryForm', 'toolbar', 'systemToolbar', 'paging', 'accentPalette', 'pageSizes']);
    return <BasicTable loading={items.loading} items={items()!} {...basicProps} extraFooter={footer} extraHeader={header} />;
}
