// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { useSearchParams } from '@solidjs/router';
import { createResource, createSignal, JSX, mergeProps, Show, splitProps } from 'solid-js';

import { useApp, useOptions } from '@/app/context';
import { Palette } from '@/components/base';
import { SplitButton } from '@/components/button';
import { Divider } from '@/components/divider';
import { ObjectAccessor } from '@/components/form';
import { PaginationBar } from '@/components/pagination';
import { Exporter, Page } from '@/core';
import type { Props as BaseProps } from './basic';
import { default as BasicTable } from './basic';
import { fromSearch, Params, Query, saveSearch } from './search';

export interface Methods<T extends object> {
    /**
     * 表格当前页的数据
     */
    items(): Array<T> | undefined;

    /**
     * 刷新表格中的数据
     */
    refresh(): Promise<void>;
}

type BaseTableProps<T extends object, Q extends Query> = Omit<BaseProps<T>, 'items' | 'extraHeader' | 'extraFooter'> & {
    ref?: { (el: Methods<T>): void };

    /**
     * 是否需要将参数反映在地址的查询参数中
     */
    inSearch?: boolean;

    /**
     * 下载的文件名
     *
     * NOTE: 这是一个静态数据，无法在运行过程中改变。
     */
    filename?: string;

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
     *
     * NOTE: 如果 {@link Props#inSearch} 为 true，那么地址中的参数将覆盖此参数中的相同名称的字段。
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
};

export type Props<T extends object, Q extends Query> = BaseTableProps<T, Q> & {
    /**
     * 加载数据的方法
     *
     * NOTE: 这是一个静态数据，无法在运行过程中改变。
     */
    load: { (q: Q): Promise<Page<T> | undefined>; };

    /**
     * 数据是否分页展示
     *
     * NOTE: 这是一个静态数据，无法在运行过程中改变。
     */
    paging: true;

    /**
     * 可用的每页展示数量
     *
     * NOTE: 只有在 paging 为 true 时才会有效
     */
    pageSizes?: Array<number>;
} | BaseTableProps<T, Q> & {
    load: { (q: Q): Promise<Array<T> | undefined>; };
    paging?: false;
};

const defaultProps = {
    filename: 'download',
    striped: 0,
    accentPalette: 'primary' as Palette,
} as const;

/**
 * 基于加载方法加载数据的表格
 *
 * T 为数据中每一条数据的类型；
 * Q 为查询参数的类型；
 */
export default function<T extends object, Q extends Query>(props: Props<T, Q>) {
    const opt = useOptions();
    const ctx = useApp();

    let load = props.load;
    props = mergeProps(defaultProps, { pageSizes: opt.api.pageSizes }, props);

    const [searchG, searchS] = useSearchParams<Params<Q>>();
    if (props.inSearch) {
        props.queries = fromSearch(props.queries, searchG);

        load = (async (q: Q) => {
            const ret = await props.load(q);
            saveSearch(q, searchS);
            return ret;
        }) as Props<T,Q>['load'];
    }

    const queries = new ObjectAccessor<Q>(props.queries);
    const [total, setTotal] = createSignal<number>(100);

    const [items, { refetch }] = createResource(async () => {
        const ret = await load(queries.object());

        if (ret === undefined) {
            return undefined;
        }else if (Array.isArray(ret)) {
            return ret;
        } else {
            setTotal(ret.count);
            return ret.current;
        }
    });

    if (props.ref) {
        props.ref({
            items: () => { return items(); },
            refresh: async () => { await refetch(); }
        });
    }

    const exports = async function (ext: Parameters<Exporter<T>['export']>[1]) {
        const e = new Exporter(props.columns);
        const q = { ...queries.object() };
        delete q.size;
        delete q.page;

        await e.download(()=>{return load(q);});
        e.export(props.filename!, ext);
    };

    let footer: JSX.Element | undefined;

    if (props.paging) {
        const page = queries.accessor<number>('page');
        const size = queries.accessor<number>('size');
        if (size.getValue()===0) {
            size.setValue(opt.api.pageSizes[1]);
        }

        footer = <PaginationBar class="mt-2" palette={props.accentPalette}
            onPageChange={(p) => { page.setValue(p); refetch(); }}
            onSizeChange={(s) => { size.setValue(s); refetch(); }}
            page={page.getValue()} size={size.getValue()} sizes={props.pageSizes} total={total()} />;
    }

    const header = <header class="header">
        <Show when={props.queryForm}>
            <form class="search">
                {props.queryForm!(queries)}
                <div class="actions">
                    <SplitButton pos='bottomright' palette='primary' type='submit' onClick={() => refetch()} menus={[
                        { type: 'item', onClick: async() => { await exports('.csv'); } , label: <>
                            <span class="c--icon mr-2">csv</span>
                            {ctx.t('_i.table.exportTo', { type: 'CSV' })}
                        </>
                        },
                        { type: 'item', onClick: async() => { await exports('.xlsx'); }, label: <>
                            <span class="c--icon mr-2">rubric</span>
                            {ctx.t('_i.table.exportTo', { type: 'Excel' })}
                        </>
                        },
                        { type: 'item', onClick: async() => { await exports('.ods'); }, label: <>
                            <span class="c--icon mr-2">ods</span>
                            {ctx.t('_i.table.exportTo', { type: 'ODS' })}
                        </>
                        },
                        { type: 'divider' },
                        { type: 'item', onClick: () => { queries.reset(); }, disabled:queries.isPreset(), label: <>
                            <span class="c--icon mr-2">restart_alt</span>
                            {ctx.t('_i.reset')}
                        </>
                        },
                    ]}>
                        {ctx.t('_i.search')}
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
                        aria-label={ctx.t('_i.refresh')}
                        title={ctx.t('_i.refresh')}>refresh</button>
                </Show>
            </div>
        </Show>
    </header>;

    if (!props.paging) {
        const [_, basicProps] = splitProps(props, ['load', 'queries', 'queryForm', 'toolbar', 'systemToolbar', 'accentPalette']);
        return <BasicTable loading={items.loading} items={items()!} {...basicProps} extraFooter={footer} extraHeader={header} />;
    }
    const [_, basicProps] = splitProps(props, ['load', 'queries', 'queryForm', 'toolbar', 'systemToolbar', 'paging', 'accentPalette', 'pageSizes']);
    return <BasicTable loading={items.loading} items={items()!} {...basicProps} extraFooter={footer} extraHeader={header} />;
}
