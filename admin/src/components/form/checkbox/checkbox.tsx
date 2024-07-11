// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, JSX, mergeProps, Show } from 'solid-js';

import { Color } from '@/components/base';

export interface Props {
    /**
     * 是否需要显示多选按钮的图标
     */
    icon?: boolean;

    /**
     * 复选框的默认状态，undefined 表示未确定的状态，true 为选中，false 为未选中。
     */
    checked?: boolean;

    color?: Color;
    label?: JSX.Element;
    disabled?: boolean;
    readonly?: boolean;
    onChange?: { (v?: boolean): void };
    title?: string;

    checkedIcon?: string;
    uncheckedIcon?: string;
    indeterminateIcon?: string;
}

const defaultProps: Partial<Props> = {
    icon: true,
    checkedIcon: 'check_box',
    uncheckedIcon: 'check_box_outline_blank',
    indeterminateIcon: 'indeterminate_check_box'
};

export default function(props: Props) {
    props = mergeProps(defaultProps, props);
    const [chk, setChk] = createSignal(props.checked);

    return <label title={props.title} classList={{
        'checkbox': true,
        [`scheme--${props.color}`]: !!props.color,
        'border': !props.icon
    }}>
        <input type="checkbox"
            readOnly={props.readonly}
            disabled={props.disabled}
            checked={chk()}
            class="appearance-none"
            onChange={() => {
                if (!props.readonly && !props.disabled) {
                    setChk(!chk());
                    if (props.onChange) {
                        props.onChange(chk());
                    }
                }
            }}
        />
        <Show when={props.icon}>
            <span class="checkbox-icon material-symbols-outlined">
                { chk() === undefined ? props.indeterminateIcon : (chk() ? props.checkedIcon : props.uncheckedIcon) }
            </span>
        </Show>
        {props.label}
    </label>;
}
