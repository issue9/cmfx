// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { For, JSX, mergeProps, Show } from 'solid-js';

import { Color } from '@/components/base';
import { Accessor } from '@/components/form';

type Value = string | number;

export interface Props {
    /**
     * 是否需要显示单选按钮的图标
     */
    icon?: boolean;

    color?: Color;
    label?: string;
    disabled?: boolean;
    readonly?: boolean;
    vertical?: boolean;
    accessor: Accessor<Value>;
    options: Array<[Value, JSX.Element]>;
}

const defaultProps: Partial<Props> = { color: 'primary', icon: true };

export default function Group (props:Props) {
    props = mergeProps(defaultProps, props);
    const access = props.accessor;

    return <fieldset disabled={props.disabled} class={`radio-group field scheme--${props.color}`}>
        <Show when={props.label}>
            <legend>{props.label}</legend>
        </Show>

        <div classList={{
            'flex': true,
            'gap-1': true,
            'flex-col': props.vertical
        }}>
            <For each={props.options}>
                {(item) =>
                    <label classList={{'border': !props.icon}}>
                        <input type="radio" class="appearance-none"
                            readOnly={props.readonly}
                            checked={item[0] === access.getValue()}
                            name={props.accessor.name()}
                            value={item[0]}
                            onChange={() => {
                                if (!props.readonly && !props.disabled && access.getValue() !== item[0]) {
                                    access.setValue(item[0]);
                                    access.setError();
                                }
                            }}
                        />
                        <Show when={props.icon}>
                            <span class="radio-icon material-symbols-outlined">
                                {access.getValue() === item[0] ? 'radio_button_checked' : 'radio_button_unchecked'}
                            </span>
                        </Show>
                        {item[1]}
                    </label>
                }
            </For>
        </div>
        <p class="field_error" role="alert">{access.getError()}</p>
    </fieldset>;
}
