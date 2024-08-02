// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { For, mergeProps, Show } from 'solid-js';

import { BaseProps, ElementProp, renderElementProp } from '@/components/base';
import { Column } from './types';

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
     * 指定条纹色的间隔
     * - 0 表示没有；
     */
    striped?: number;

    /**
     * tr 是否响应 hover 事件
     */
    hoverable?: boolean;
}

const defaultProps = {
    // TODO
} as const;

/**
 * 表格组件
 */
export default function<T extends object>(props: Props<T>) {
    props = mergeProps(defaultProps, props);

    if (props.striped !== undefined && props.striped < 0) {
        throw 'striped 必须大于或是等于 0';
    }

    return <table classList={{
        'c--table': true,
        'c--table-fixed': props.fixedLayout,
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

        <tbody class={props.hoverable ? 'hoverable' : undefined}>
            <For each={props.items}>
                {(item, index)=>(
                    <tr class={(props.striped && index() % props.striped === 0) ? 'striped' : undefined}>
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
