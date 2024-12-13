// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, JSX, mergeProps, Show } from 'solid-js';

import { FieldBaseProps } from '@/components/form';
import { Icon, IconSymbol } from '@/components/icon';

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

    checkedIcon?: IconSymbol;
    uncheckedIcon?: IconSymbol;
    indeterminateIcon?: IconSymbol;
}

const presetProps: Readonly<Props> = {
    tabindex: 0,
    checkedIcon: 'check_box',
    uncheckedIcon: 'check_box_outline_blank',
    indeterminateIcon: 'indeterminate_check_box'
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
            class="appearance-none hidden"
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
            <Icon class="mr-1" icon={ chk() === undefined ? props.indeterminateIcon! : (chk() ? props.checkedIcon! : props.uncheckedIcon!) } />
        </Show>
        {props.label}
    </label>;
}
