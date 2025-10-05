// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createMemo, JSX, mergeProps } from 'solid-js';

import { AvailableEnumType, joinClass } from '@/base';
import { FieldBaseProps } from '@/form/field';
import styles from './style.module.css';

export interface Props extends Omit<FieldBaseProps, 'layout' | 'hasHelp'> {
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

    onChange?: { (v?: boolean): void };

    rounded?: boolean;

    name?: string;

    value?: AvailableEnumType;
}

/**
 * 带文本提示的单选框
 */
export function Radio(props: Props): JSX.Element {
    props = mergeProps({ tabindex: 0 } as Props, props);

    const cls = createMemo(() => {
        return joinClass(props.palette,
            props.block ? styles.block : '',
            props.rounded ? styles.rounded : '',
            styles.radio,
            props.class
        );
    });

    let ref: HTMLLabelElement;
    createEffect(() => {
        const block = props.block;
        if (!block) { return; }
        const checked = props.checked;
        checked ? ref.focus() : ref.blur();
    });

    return <label role="radio" ref={el => ref = el} title={props.title} class={cls()}
        tabindex={props.block ? props.tabindex : -1}
        aria-checked={props.checked} aria-readonly={props.readonly} aria-disabled={props.disabled}
    >
        <input type="radio" checked={props.checked}
            class={joinClass(undefined, props.rounded ? styles.rounded : '')}
            disabled={props.disabled} name={props.name}
            aria-hidden={props.block} onclick={e => {
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
