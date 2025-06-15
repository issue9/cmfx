// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { For, JSX, mergeProps, Show } from 'solid-js';

import { BaseProps, joinClass } from '@/base';
import { useLocale } from '@/context';
import { Spin } from '@/spin';
import { Column } from './column';
import styles from './style.module.css';

export interface Props<T extends object> extends BaseProps {
    /**
     * 是否根据第一行数据或是 col 的定义固定列的宽度，这可以提升一些渲染性能，
     * 但是可能会造成空间的巨大浪费。具体可查看：
     * https://developer.mozilla.org/zh-CN/docs/Web/CSS/table-layout 。
     */
    fixedLayout?: boolean;

    loading?: boolean;

    /**
     * 列的定义
     */
    columns: Array<Column<T>>;

    /**
     * 表格的数据
     */
    items?: Array<T>;

    /**
     * 指定条纹色的间隔
     * - 0 表示没有；
     */
    striped?: number;

    /**
     * tr 是否响应 hover 事件
     */
    hoverable?: boolean;

    /**
     * 固定表格头部位于指定的位置，如果为 undefined，表示不固定。
     */
    stickyHeader?: string;

    /**
     * 表格顶部的扩展空间
     *
     * NOTE: 该区域不属于 table 空间。
     */
    extraHeader?: JSX.Element;

    /**
     * 表格底部的扩展空间
     *
     * NOTE: 该区域不属于 table 空间。
     */
    extraFooter?: JSX.Element;

    ref?: { (el: HTMLElement): void };
}

const presetProps = {
    striped: 0
} as const;

/**
 * 基础的表格组件
 */
export function BasicTable<T extends object>(props: Props<T>) {
    props = mergeProps(presetProps, props);

    const l = useLocale();

    if (props.striped !== undefined && props.striped < 0) {
        throw 'striped 必须大于或是等于 0';
    }

    const hasCol = props.columns.findIndex((v) => !!v.colClass) >= 0;

    return <Spin spinning={props.loading} palette={props.palette} class={styles.table}
        ref={(el: HTMLElement) => { if (props.ref) { props.ref(el); } }}>
        <Show when={props.extraHeader}>
            {props.extraHeader}
        </Show>

        <table class={joinClass('cmfx-table', props.fixedLayout ? styles['fixed-layout'] : undefined)}>
            <Show when={hasCol}>
                <colgroup>
                    <For each={props.columns}>
                        {(item) => (<col class={item.colClass} />)}
                    </For>
                </colgroup>
            </Show>

            <thead style={{
                'position': props.stickyHeader === undefined ? undefined : 'sticky',
                'top': props.stickyHeader === undefined ? undefined : props.stickyHeader,
            }}>
                <tr>
                    <For each={props.columns}>
                        {(item) => (
                            <th class={item.headClass ?? item.cellClass}>{item.renderLabel ?? (item.label ?? item.id)}</th>
                        )}
                    </For>
                </tr>
            </thead>

            <tbody class={props.hoverable ? styles.hoverable : undefined}>
                <Show when={props.items && props.items.length > 0}>
                    <For each={props.items}>
                        {(item, index) => (
                            <tr class={(props.striped && index() % props.striped === 0) ? styles.striped : undefined}>
                                <For each={props.columns}>
                                    {(h) => {
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
                        <td class={styles.nodata} colSpan={props.columns.length}>{l.t('_c.table.nodata')}</td>
                    </tr>
                </Show>
            </tbody>
        </table>

        <Show when={props.extraFooter}>{props.extraFooter}</Show>
    </Spin>;
}
