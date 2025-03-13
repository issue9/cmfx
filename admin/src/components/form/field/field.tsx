// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, ParentProps, Show } from 'solid-js';

import { Accessor } from './access';
import type { Props } from './types';

export interface FieldArea {
    pos: 'top-left' | 'top-center' | 'top-right'
    | 'middle-left' | 'middle-center' | 'middle-right'
    | 'bottom-left' | 'bottom-center' | 'bottom-right';

    cols?: 1 | 2 | 3;
}

export type FieldProps<T> = ParentProps<Props & {
    hasError: Accessor<T>['hasError'],
    getError: Accessor<T>['getError'],

    errArea: FieldArea;
    labelArea: FieldArea;
    inputArea: FieldArea;

    ref?: { (el: HTMLDivElement): void; }
}>;

function fieldArea2Style(area: FieldArea): JSX.CSSProperties {
    return {
        'grid-area': area.pos,
        'grid-column-end': area.cols ? 'span ' + area.cols : undefined,
    };
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
 */
export default function Field<T>(props: FieldProps<T>): JSX.Element {
    return <div class={props.class} ref={(el) => { if (props.ref) { props.ref(el); }}} classList={{
        'c--field': true,
        [`palette--${props.palette}`]: !!props.palette,
        ...props.classList,
    }}>
        <Show when={props.label}>
            <div style={fieldArea2Style(props.labelArea)}>{props.label}</div>
        </Show>

        <div class="c--field-content" style={fieldArea2Style(props.inputArea)}>
            {props.children}
        </div>
        <Show when={props.hasError()}>
            <p class="c--field_error" style={fieldArea2Style(props.errArea)} role="alert">{props.getError()}</p>
        </Show>
    </div>;
}