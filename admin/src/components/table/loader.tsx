// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { useSearchParams } from '@solidjs/router';
import { createResource, createSignal, JSX, mergeProps, Show, splitProps } from 'solid-js';

import { Palette } from '@/components/base';
import { Button, FitScreenButton, PrintButton, SplitButton } from '@/components/button';
import { useApp, useOptions } from '@/components/context';
import { Divider } from '@/components/divider';
import { ObjectAccessor } from '@/components/form';
import { PaginationBar } from '@/components/pagination';
import { Menu } from '@/components/tree';
import { Label } from '@/components/typography';
import { Exporter, Page, Query } from '@/core';
import type { Props as BaseProps } from './basic';
import { BasicTable } from './basic';
import { fromSearch, Params, saveSearch } from './search';

export interface Ref<T extends object> {
    /**
     * 表格当前页的数据
     */
    items(): Array<T> | undefined;

    /**
     * 刷新表格中的数据
     */
    refresh(): Promise<void>;

    element: HTMLElement;
}

type BaseTableProps<T extends object, Q extends Query> = Omit<BaseProps<T>, 'items' | 'extraHeader' | 'extraFooter' | 'ref'> & {
    ref?: { (el: Ref<T>): void };

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

const presetProps = {
    filename: 'download',
    striped: 0,
    accentPalette: 'primary' as Palette,
} as const;

/**
 * 基于加载方法加载数据的表格
 *
 * @template T 为数据中每一条数据的类型；
 * @template Q 为查询参数的类型；
 */
export function LoaderTable<T extends object, Q extends Query>(props: Props<T, Q>) {
    const opt = useOptions();
    const ctx = useApp();
    let ref: HTMLElement;

    let load = props.load;
    props = mergeProps(presetProps, { pageSizes: opt.api.pageSizes }, props);

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
            refresh: async () => { await refetch(); },
            element: ref!,
        });
    }

    const exports = async function (ext: Parameters<Exporter<T>['export']>[1]) {
        const e = new Exporter(props.columns);
        const q = { ...queries.object() };
        delete q.size;
        delete q.page;

        await e.download(async()=>{return await load(q);});
        e.export(props.filename!, ext);
    };

    let footer: JSX.Element | undefined;

    if (props.paging) {
        const page = queries.accessor<number>('page');
        const size = queries.accessor<number>('size');
        if (size.getValue()===0) {
            size.setValue(opt.api.pageSizes[1]);
        }

        footer = <PaginationBar class="footer" palette={props.accentPalette}
            onPageChange={async(p) => { page.setValue(p); await refetch(); }}
            onSizeChange={async(s) => { size.setValue(s); await refetch(); }}
            page={page.getValue()} size={size.getValue()} sizes={props.pageSizes} total={total()} />;
    }

    const [hoverable, setHoverable] = createSignal(props.hoverable);
    const [striped, setStriped] = createSignal(props.striped);
    const [sticky, setSticky] = createSignal(props.stickyHeader);

    const header = <header class="header">
        <Show when={props.queryForm}>
            <form class="search">
                {props.queryForm!(queries)}
                <div class="actions">
                    <SplitButton palette='primary' type='submit' onClick={async () => await refetch()} menus={[
                        {
                            type: 'item', onClick: async () => { await exports('.csv'); }, label: <Label icon="csv">
                                {ctx.locale().t('_i.table.exportTo', { type: 'CSV' })}
                            </Label>
                        },
                        {
                            type: 'item', onClick: async () => { await exports('.xlsx'); }, label: <Label icon="horizontal_split">
                                {ctx.locale().t('_i.table.exportTo', { type: 'Excel' })}
                            </Label>
                        },
                        {
                            type: 'item', onClick: async () => { await exports('.ods'); }, label: <Label icon="ods">
                                {ctx.locale().t('_i.table.exportTo', { type: 'ODS' })}
                            </Label>
                        },
                        { type: 'divider' },
                        {
                            type: 'item', onClick: () => { queries.reset(); }, disabled: queries.isPreset(), label: <Label icon='restart_alt'>
                                {ctx.locale().t('_i.reset')}
                            </Label>
                        },
                    ]}>
                        {ctx.locale().t('_i.search')}
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
                    <div class="system-toolbar">
                        <Menu hoverable direction='left' selectedClass='' activator={
                            <Button icon rounded kind='fill' palette='tertiary'>table_rows_narrow</Button>
                        } onChange={(v) => {
                            switch (v) {
                            case 'hoverable':
                                setHoverable(!hoverable());
                                break;
                            case 'sticky-header':
                                setSticky(sticky() === undefined ? '0px' : undefined);
                                break;
                            case '0':
                                setStriped(0);
                                break;
                            case '2':
                                setStriped(2);
                                break;
                            case '3':
                                setStriped(3);
                                break;
                            case '4':
                                setStriped(4);
                                break;
                            case '5':
                                setStriped(5);
                                break;
                            }
                            return true;
                        }}>
                            {[
                                {
                                    type: 'item', value: 'hoverable',
                                    label: <label class="menu-item">
                                        <input type="checkbox" checked={hoverable()} onClick={(e) => { setHoverable(!hoverable()); e.stopPropagation(); }} />
                                        {ctx.locale().t('_i.table.hoverable')}</label>
                                },
                                { type: 'divider' },
                                {
                                    type: 'item', value: 'sticky-header',
                                    label: <label class="menu-item">
                                        <input type="checkbox" checked={sticky() !== undefined} onClick={(e) => {
                                            setSticky(sticky() === undefined ? '0px' : undefined);
                                            e.stopPropagation();
                                        }}/>
                                        {ctx.locale().t('_i.table.stickyHeader')}</label>
                                },
                                { type: 'divider' },
                                {
                                    type: 'item', value: '0',
                                    label: <label class="menu-item"><input type="radio" checked={striped() == 0} />{ctx.locale().t('_i.table.noStriped')}</label>,
                                },
                                {
                                    type: 'item', value: '2',
                                    label: <label class="menu-item"><input type="radio" checked={striped() == 2} />{ctx.locale().t('_i.table.striped', { 'num': 2 })}</label>,
                                },
                                {
                                    type: 'item', value: '3',
                                    label: <label class="menu-item"><input type="radio" checked={striped() == 3} />{ctx.locale().t('_i.table.striped', { 'num': 3 })}</label>,
                                },
                                {
                                    type: 'item', value: '4',
                                    label: <label class="menu-item"><input type="radio" checked={striped() == 4} />{ctx.locale().t('_i.table.striped', { 'num': 4 })}</label>,
                                },
                                {
                                    type: 'item', value: '5',
                                    label: <label class="menu-item"><input type="radio" checked={striped() == 5} />{ctx.locale().t('_i.table.striped', { 'num': 5 })}</label>,
                                },
                            ]}
                        </Menu>
                        <Button icon rounded kind='fill' palette='tertiary' onClick={async () => await refetch()}
                            aria-label={ctx.locale().t('_i.refresh')}
                            title={ctx.locale().t('_i.refresh')}>refresh</Button>
                        <FitScreenButton rounded kind='fill' palette='tertiary' expand='expand_content' collapse='collapse_content' container={()=>ref}
                            aria-title={ctx.locale().t('_i.table.fitScreen')}
                            title={ctx.locale().t('_i.table.fitScreen')} />
                        <PrintButton icon rounded kind='fill' palette='tertiary' container={()=>ref.querySelector('table')!}
                            cssText='table {border-collapse: collapse; width: 100%} tr{border-bottom: 1px solid black;} th,td {text-align: left} .no-print{display:none}'
                            aria-label={ctx.locale().t('_i.print')}
                            title={ctx.locale().t('_i.print')}>print</PrintButton>
                    </div>
                </Show>
            </div>
        </Show>
    </header>;

    if (!props.paging) {
        const [_, basicProps] = splitProps(props, ['load', 'queries', 'queryForm', 'toolbar', 'systemToolbar', 'accentPalette', 'hoverable', 'striped', 'stickyHeader', 'ref']);
        return <BasicTable ref={(el)=>ref=el} stickyHeader={sticky()} striped={striped()} hoverable={hoverable()} loading={items.loading} items={items()!} {...basicProps} extraFooter={footer} extraHeader={header} />;
    }
    const [_, basicProps] = splitProps(props, ['load', 'queries', 'queryForm', 'toolbar', 'systemToolbar', 'paging', 'accentPalette', 'pageSizes', 'hoverable', 'striped', 'stickyHeader', 'ref']);
    return <BasicTable ref={(el)=>ref=el} stickyHeader={sticky()} striped={striped()} hoverable={hoverable()} loading={items.loading} items={items()!} {...basicProps} extraFooter={footer} extraHeader={header} />;
}
