// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps } from 'solid-js';

import { classList, joinClass } from '@/base';
import { FieldBaseProps } from '@/form/field';
import styles from './style.module.css';

export interface Props extends Omit<FieldBaseProps, 'layout' | 'hasHelp'> {
    /**
     * 是否显示为块
     *
     * NOTE: 该模式下 {Props#indeterminate} 无法有效地表示。
     */
    block?: boolean;

    /**
     * 复选框的初始状态，true 为选中，false 为未选中。
     */
    checked?: boolean;

    onChange?: { (v?: boolean): void };

    rounded?: boolean;

    name?: string;
}

const presetProps: Readonly<Props> = {
    tabindex: 0,
};

/**
 * 带文本提示的单选框
 */
export function Radio(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);

    return <label tabIndex={props.tabindex} title={props.title} class={classList({
        [styles.block]: props.block,
        [`palette--${props.palette}`]: !!props.palette
    }, styles.radio, props.class)}>
        <input type="radio"
            name={props.name}
            title={props.title}
            readOnly={props.readonly}
            disabled={props.disabled}
            checked={props.checked}
            class={joinClass(props.block ? '!hidden' : '', props.rounded ? styles.rounded : '', props.class)}
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
