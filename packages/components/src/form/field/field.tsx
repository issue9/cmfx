// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, ParentProps, Show } from 'solid-js';

import { joinClass, Layout } from '@/base';
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
     * 向后跨的列数
     */
    cols?: 1 | 2 | 3;

    /**
     * 向下跨的行数
     */
    rows?: 1 | 2 | 3;
}

interface FieldAreas {
    helpArea?: FieldArea;
    labelArea?: FieldArea;
    inputArea: FieldArea;
}

export type FieldProps<T> = ParentProps<Props & FieldAreas & {
    getError: Accessor<T>['getError'],

    /**
     * 显示在 helpArea 区域的提示信息
     */
    help?: JSX.Element;

    ref?: { (el: HTMLDivElement): void; };
}>;

function fieldArea2Style(area: FieldArea): JSX.CSSProperties {
    return {
        'grid-area': area.pos,
        'grid-column-end': area.cols ? (`span ${area.cols}`) : undefined,
        'grid-row-end': area.rows ? (`span ${area.rows}`) : undefined,
    };
}

/**
 * 根据布局 l 生成通用的各个字段位置
 *
 * @param l 布局方式；
 * @param hasHelp 是否需要计算显示帮助信息的区域；
 * @param hasLabel 是否需要计算标题区域；
 */
export function calcLayoutFieldAreas(l: Layout, hasHelp: boolean, hasLabel: boolean): FieldAreas {
    // NOTE: grid 中如果一个列或是行，即使其宽或是高度为 0，gap 也不会消失，
    // 所以得根据 layout 计算位置并填充多余的列。

    if (l === 'horizontal') { return calcHorizontalFieldAreas(hasHelp, hasLabel); }
    return calcVerticalFieldAreas(hasHelp, hasLabel);
}

function  calcHorizontalFieldAreas(hasHelp: boolean, hasLabel: boolean): FieldAreas {
    if (hasLabel) {
        if (hasHelp) {
            return {
                labelArea: { pos: 'top-left' }, // label 只需要与 input 横向对齐，所以 rows 应该保持与 input 一样。
                inputArea: { pos: 'top-center', cols: 2 },
                helpArea: { pos: 'middle-center', cols: 2, rows: 2 }
            };
        }

        return {
            labelArea: { pos: 'top-left', rows: 3 },
            inputArea: { pos: 'top-center', cols: 2, rows: 3 },
        };
    }

    if (hasHelp) {
        return {
            inputArea: { pos: 'top-left', cols: 3 },
            helpArea: { pos: 'middle-left', cols: 3, rows: 2 }
        };
    }

    return { inputArea: { pos: 'top-left', cols: 3, rows: 3 } };
}

function  calcVerticalFieldAreas(hasHelp: boolean, hasLabel: boolean): FieldAreas {
    if (hasLabel) {
        if (hasHelp) {
            return {
                labelArea: { pos: 'top-left', cols: 3 },
                inputArea: { pos: 'middle-left', cols: 3 },
                helpArea: { pos: 'bottom-left', cols: 3 }
            };
        }

        return {
            labelArea: { pos: 'top-left', cols: 3 },
            inputArea: { pos: 'middle-left', cols: 3, rows: 2 },
        };
    }

    if (hasHelp) {
        return {
            inputArea: { pos: 'top-left', cols: 3 },
            helpArea: { pos: 'middle-left', cols: 3, rows: 2 }
        };
    }

    return { inputArea: { pos: 'top-left', cols: 3, rows: 3 } };
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
    // NOTE: 采用 grid 主要是方便对齐方式的实现。
    // 比如 label 应该是与 input 对象居中对齐，而不是 input+help 的整个元素；
    // help 应该与 input 左对齐，而不是与 label 左对齐。

    return <div class={joinClass(styles.field, props.class, props.palette ? `palette--${props.palette}` : undefined)}
        ref={(el) => { if (props.ref) { props.ref(el); } }}>
        <Show when={props.labelArea}>
            {(area)=>(<label style={fieldArea2Style(area())}>{props.label}</label>)}
        </Show>

        <div class={styles.content} style={fieldArea2Style(props.inputArea)}>
            {props.children}
        </div>

        <Show when={props.helpArea}>
            {(area)=>(
                <p style={fieldArea2Style(area())} role="alert" class={joinClass(styles.help, props.getError() ? styles.error : undefined)}>
                    {props.getError() ?? props.help}
                </p>
            )}
        </Show>
    </div>;
}
