// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { For, JSX, Show } from 'solid-js';

import { joinClass } from '@/base';
import { useLocale } from '@/context';
import { Empty } from '@/result';
import { Spin } from '@/spin';
import { Column } from './column';
import styles from './style.module.css';
import { Table, Props as TableProps } from './table';

export interface Props<T extends object> extends Omit<TableProps, 'ref'> {
    /**
     * 是否加载状态
     *
     * @reactive
     */
    loading?: boolean;

    /**
     * 列的定义
     *
     * @reactive
     */
    columns: Array<Column<T>>;

    /**
     * 表格的数据
     *
     * @reactive
     */
    items?: Array<T>;

    /**
     * 固定表格头部位于指定的位置
     *
     * @remarks 如果为 undefined，表示不固定，其它值表示离顶部的距离。
     *
     * @reactive
     */
    stickyHeader?: string;

    /**
     * 表格顶部的扩展空间
     *
     * NOTE: 该区域不属于 table 空间。
     *
     * @reactive
     */
    extraHeader?: JSX.Element;

    /**
     * 表格底部的扩展空间
     *
     * NOTE: 该区域不属于 table 空间。
     *
     * @reactive
     */
    extraFooter?: JSX.Element;

    ref?: { (el: HTMLElement): void };
}

/**
 * 基础的表格组件
 */
export function BasicTable<T extends object>(props: Props<T>) {
    const l = useLocale();

    const hasCol = props.columns.findIndex(v => !!v.colClass) >= 0;

    return <Spin spinning={props.loading} palette={props.palette} class={joinClass(undefined, styles.table, props.class)}
        ref={(el: HTMLElement) => { if (props.ref) { props.ref(el); } }}>
        <Show when={props.extraHeader}>
            {props.extraHeader}
        </Show>

        <Table fixedLayout={props.fixedLayout} hoverable={props.hoverable} striped={props.striped}>
            <Show when={hasCol}>
                <colgroup>
                    <For each={props.columns}>
                        {item => (<col class={item.colClass} />)}
                    </For>
                </colgroup>
            </Show>

            <thead style={{
                'position': props.stickyHeader === undefined ? undefined : 'sticky',
                'top': props.stickyHeader === undefined ? undefined : props.stickyHeader,
            }}>
                <tr>
                    <For each={props.columns}>
                        {item => (
                            <th class={item.headClass ?? item.cellClass}>{item.renderLabel ?? (item.label ?? item.id)}</th>
                        )}
                    </For>
                </tr>
            </thead>

            <tbody>
                <Show when={props.items && props.items.length > 0}>
                    <For each={props.items}>
                        {item => (
                            <tr>
                                <For each={props.columns}>
                                    {h => {
                                        const i = h.id in item ? (item as any)[h.id] : undefined;
                                        return <td class={h.cellClass}>
                                            {h.renderContent ? h.renderContent(h.id, i, item) : (h.content ? h.content(h.id, i, item) : i)}
                                        </td>;
                                    }}
                                </For>
                            </tr>
                        )}
                    </For>
                </Show>
                <Show when={!props.items || props.items.length === 0}>
                    <tr>
                        <td colSpan={props.columns.length}><Empty palette={props.palette}>{l.t('_c.table.nodata')}</Empty></td>
                    </tr>
                </Show>
            </tbody>
        </Table>

        <Show when={props.extraFooter}>{props.extraFooter}</Show>
    </Spin>;
}
