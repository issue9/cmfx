// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, JSX, mergeProps } from 'solid-js';

import { FieldBaseProps } from '@/components/form';

export interface Props extends FieldBaseProps {
    /**
     * 是否显示为块
     */
    block?: boolean;

    /**
     * 复选框的初始状态，undefined 表示未确定的状态，true 为选中，false 为未选中。
     */
    checked?: boolean;

    onChange?: { (v?: boolean): void };
}

const presetProps: Readonly<Props> = {
    tabindex: 0,
};

export function Checkbox(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);
    const [chk, setChk] = createSignal(props.checked);

    return <label tabIndex={props.tabindex} accessKey={props.accessKey} title={props.title} class={props.class} classList={{
        ...props.classList,
        'c--checkbox': true,
        'c--checkbox-border': props.block,
        [`palette--${props.palette}`]: !!props.palette
    }}>
        <input type="checkbox"
            readOnly={props.readonly}
            disabled={props.disabled}
            checked={chk()}
            class={props.block ? '!hidden' : 'undefined'}
            onChange={() => {
                if (!props.readonly && !props.disabled) {
                    setChk(!chk());
                    if (props.onChange) {
                        props.onChange(chk());
                    }
                }
            }}
        />
        {props.label}
    </label>;
}
