// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { For, mergeProps, Show } from 'solid-js';

import { BaseProps, ElementProp, renderElementProp } from '@/components/base';
import { Column, Striped } from './types';

export interface Props<T extends object> extends BaseProps {
    /**
     * 是否根据第一行数据或是 col 的定义固定列的宽度，这可以提升一些渲染性能，
     * 具体可查看 https://developer.mozilla.org/zh-CN/docs/Web/CSS/table-layout 。
     */
    fixedLayout?: boolean;

    /**
     * 是否固定表头
     */
    // TODO sticky?: boolean;

    /**
     * 表头的定义
     */
    header: Array<Column<T>>;

    /**
     * 表格的数据
     */
    items: Array<T>;

    /**
     * 表格标题
     */
    caption?: ElementProp;

    /**
     * 条纹色
     */
    striped?: Striped;
}

const defaultProps = {
    // TODO
} as const;

/**
 * 表格组件
 */
export default function<T extends object>(props: Props<T>) {
    props = mergeProps(defaultProps, props);

    return <table classList={{
        'c--table': true,
        'c--table-fixed': props.fixedLayout,
        [`c--table-striped-${props.striped}`]: !!props.striped,
        [`palette--${props.palette}`]: !!props.palette
    }}>
        <Show when={props.caption}>
            <caption>{ renderElementProp(props.caption) }</caption>
        </Show>

        <thead>
            <tr>
                <For each={props.header}>
                    {(item)=>(
                        <th class={item.headClass ?? item.cellClass}>{ item.label ? renderElementProp(item.label) : item.id }</th>
                    )}
                </For>
            </tr>
        </thead>

        <tbody>
            <For each={props.items}>
                {(item)=>(
                    <tr>
                        <For each={props.header}>
                            {(h) => {
                                const i = h.id in item ? (item as any)[h.id] : undefined;
                                return <td class={h.cellClass}>{h.render ? h.render(h.id, i, item) : i}</td>;
                            }}
                        </For>
                    </tr>
                )}
            </For>
        </tbody>
    </table>;
}
