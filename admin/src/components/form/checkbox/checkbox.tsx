// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps } from 'solid-js';

import { FieldBaseProps } from '@/components/form/field';

export interface Props extends FieldBaseProps {
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
    tabindex: 0,
};

export function Checkbox(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);

    return <label tabIndex={props.tabindex} title={props.title} class={props.class} classList={{
        ...props.classList,
        'c--checkbox': true,
        'c--checkbox-border': props.block,
        [`palette--${props.palette}`]: !!props.palette
    }}>
        <input type="checkbox"
            readOnly={props.readonly}
            disabled={props.disabled}
            checked={props.checked}
            classList={{ '!hidden': props.block }}
            onClick={(e)=>{
                if (props.readonly) {
                    e.preventDefault();
                }
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
