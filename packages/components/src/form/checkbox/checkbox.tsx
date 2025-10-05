// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createMemo, JSX, mergeProps } from 'solid-js';

import { joinClass } from '@/base';
import { FieldBaseProps } from '@/form/field';
import styles from './style.module.css';

export interface Props extends Omit<FieldBaseProps, 'layout' | 'hasHelp'> {
    /**
     * 设置为不确定状态，只负责样式控制。
     */
    indeterminate?: boolean;

    /**
     * 是否显示为块
     *
     * @remarks 是否隐藏原本的单选按钮，只显示文本内容配以边框。
     */
    block?: boolean;

    /**
     * 复选框的初始状态，true 为选中，false 为未选中。
     */
    checked?: boolean;

    onChange?: { (v?: boolean): void; };
}

/**
 * 带文本提示的复选框
 */
export function Checkbox(props: Props): JSX.Element {
    props = mergeProps({ tabindex: 0 } as Props, props);
    let ref: HTMLInputElement;

    createEffect(() => { ref.indeterminate = !!props.indeterminate; });

    const cls = createMemo(() => {
        return joinClass(
            props.palette,
            props.block ? styles.block : '',
            props.rounded ? styles.rounded : '',
            styles.checkbox,
            props.class
        );
    });

    return <label role="checkbox" title={props.title} class={cls()}
        tabindex={props.block ? props.tabindex : -1}
        aria-checked={props.checked} aria-readonly={props.readonly} aria-disabled={props.disabled}
    >
        <input type="checkbox" ref={el => ref = el}
            disabled={props.disabled} aria-hidden={props.block} checked={props.checked}
            class={joinClass(undefined, props.rounded ? styles.rounded : '')}
            onClick={e => {
                if (e.target !== e.currentTarget) { return; }

                if (props.readonly) { e.preventDefault(); }
                e.stopPropagation();
            }}
            onChange={e => {
                if (!props.readonly && !props.disabled && props.onChange) {
                    props.onChange(e.currentTarget.checked);
                }
            }}
        />
        {props.label}
    </label>;
}
