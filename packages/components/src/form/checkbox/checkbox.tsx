// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, JSX, mergeProps } from 'solid-js';

import { classList, joinClass } from '@/base';
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
     * NOTE: 该模式下 {@link indeterminate} 无法有效地表示。
     */
    block?: boolean;

    /**
     * 复选框的初始状态，true 为选中，false 为未选中。
     */
    checked?: boolean;

    onChange?: { (v?: boolean): void };
}

const presetProps: Readonly<Props> = {
    tabindex: 0,
};

/**
 * 带文本提示的复选框
 */
export function Checkbox(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);
    let ref: HTMLInputElement;

    createEffect(() => { ref.indeterminate = !!props.indeterminate; });

    return <label tabIndex={props.tabindex} title={props.title} class={classList({
        [styles.block]: props.block,
        [`palette--${props.palette}`]: !!props.palette
    }, styles.checkbox, props.class)}>
        <input type="checkbox" ref={el => ref = el}
            readOnly={props.readonly}
            disabled={props.disabled}
            checked={props.checked}
            class={joinClass(props.block ? '!hidden' : undefined, props.rounded ? styles.rounded : '')}
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
