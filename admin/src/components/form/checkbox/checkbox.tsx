// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, mergeProps, Show } from 'solid-js';

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

    checkedIcon?: string;
    uncheckedIcon?: string;
    indeterminateIcon?: string;
}

const presetProps: Partial<Props> = {
    checkedIcon: 'check_box',
    uncheckedIcon: 'check_box_outline_blank',
    indeterminateIcon: 'indeterminate_check_box'
};

export default function(props: Props) {
    props = mergeProps(presetProps, props);
    const [chk, setChk] = createSignal(props.checked);

    return <label title={props.title} classList={{
        'c--checkbox': true,
        'c--checkbox-border': props.block,
        [`palette--${props.palette}`]: !!props.palette
    }}>
        <input type="checkbox"
            accessKey={props.accessKey}
            tabIndex={props.tabindex}
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
        <Show when={!props.block}>
            <span class="checkbox-icon c--icon">
                { chk() === undefined ? props.indeterminateIcon : (chk() ? props.checkedIcon : props.uncheckedIcon) }
            </span>
        </Show>
        {props.label}
    </label>;
}
