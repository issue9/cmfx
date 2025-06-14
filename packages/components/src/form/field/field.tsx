// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, ParentProps, Show } from 'solid-js';

import { classList, joinClass, Layout } from '@/base';
import { Accessor } from './access';
import styles from './style.module.css';
import type { Props } from './types';

/**
 * 用于表示子组件所处的位置
 */
export interface FieldArea {
    /**
     * 指位置
     */
    pos: 'top-left' | 'top-center' | 'top-right'
    | 'middle-left' | 'middle-center' | 'middle-right'
    | 'bottom-left' | 'bottom-center' | 'bottom-right';

    /**
     * 跨的列数
     */
    cols?: 1 | 2 | 3;
}

interface FieldAreas {
    helpArea: FieldArea;
    labelArea: FieldArea;
    inputArea: FieldArea;
}

export type FieldProps<T> = ParentProps<Props & FieldAreas & {
    hasHelp: Accessor<T>['hasHelp'],
    getError: Accessor<T>['getError'],
    
    /**
     * 提示信息
     *
     * 该内容显示在 helpArea 区别。
     */
    help?: JSX.Element;

    ref?: { (el: HTMLDivElement): void; };
}>;

function fieldArea2Style(area: FieldArea): JSX.CSSProperties {
    return {
        'grid-area': area.pos,
        'grid-column-end': area.cols ? ('span ' + area.cols.toString()) : undefined,
    };
}

/**
 * 根据布局 l 生成通用的各个字段位置。
 */
export function calcLayoutFieldAreas(l: Layout): FieldAreas {
    // NOTE: grid 中如果一个列或是行，即使其宽或是高度为 0，gap 也不会消失，
    // 所以得根据 layout 计算位置并填充多余的列。

    switch (l) {
    case 'horizontal':
        return {
            inputArea: { pos: 'middle-center', cols: 2 },
            labelArea: { pos: 'middle-left' },
            helpArea: { pos: 'bottom-center', cols: 2 }
        };
    case 'vertical':
        return {
            inputArea: { pos: 'middle-left', cols: 3 },
            labelArea: { pos: 'top-left', cols: 3 },
            helpArea: { pos: 'bottom-left', cols: 3 }
        };
    }
}

/**
 * 表单字段的基本结构
 *
 * 所有的表单字段可基于此组件作二次开发，以达到样式上的统一。
 *
 * Field 需要指定错误信息、输入和标签三个组件所在的位置，可指定的位置如下：
 *  top-left    | top-center    | top-right
 *  middle-left | middle-center | middle-right
 *  bottom-left | bottom-center | bottom-right
 *
 * @template T 表示当前组件的值类型。
 */
export default function Field<T>(props: FieldProps<T>): JSX.Element {
    return <div class={classList(props.classList, styles.field, props.class, props.palette ? `palette--${props.palette}` : undefined)}
        ref={(el) => { if (props.ref) { props.ref(el); } }}>
        <Show when={props.label}>
            <div style={fieldArea2Style(props.labelArea)}>{props.label}</div>
        </Show>

        <div class={styles.content} style={fieldArea2Style(props.inputArea)}>
            {props.children}
        </div>
        <Show when={props.hasHelp()}>
            <p style={fieldArea2Style(props.helpArea)} role="alert" class={joinClass(styles.help, props.getError() ? styles.error : undefined)}>
                {props.getError() ?? props.help}
            </p>
        </Show>
    </div>;
}
