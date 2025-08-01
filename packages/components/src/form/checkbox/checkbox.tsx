// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, JSX, mergeProps } from 'solid-js';

import { classList } from '@/base';
import { FieldBaseProps } from '@/form/field';
import styles from './style.module.css';

export interface Props extends FieldBaseProps {
    /**
     * 设置为不确定状态，只负责样式控制。
     */
    indeterminate?: boolean;

    /**
     * 是否显示为块
     */
    block?: boolean;

    /**
     * 复选框的初始状态，true 为选中，false 为未选中。
     */
    checked?: boolean;

    onChange?: { (v?: boolean): void };
}

const presetProps: Readonly<Props> = {
    indeterminate: false,
    tabindex: 0,
};

/**
 * 带文本提示的复选框
 */
export function Checkbox(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);
    let ref: HTMLInputElement;

    createEffect(() => {
        ref.indeterminate = !!props.indeterminate;
    });

    return <label tabIndex={props.tabindex} title={props.title} class={classList({
        [styles.block]: props.block,
        [`palette--${props.palette}`]: !!props.palette
    }, props.class, styles.checkbox)}>
        <input type="checkbox" ref={el => ref = el}
            readOnly={props.readonly}
            disabled={props.disabled}
            checked={props.checked}
            class={props.block ? '!hidden' : undefined}
            onClick={(e) => {
                if (props.readonly) { e.preventDefault(); }
            }}
            onChange={(e) => {
                if (!props.readonly && !props.disabled && props.onChange) {
                    props.onChange(e.target.checked);
                }
            }}
        />
        {props.label}
    </label>;
}
