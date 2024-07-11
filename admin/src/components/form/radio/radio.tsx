// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { For, JSX, mergeProps, Show } from 'solid-js';

import { Scheme } from '@/components/base';
import { Accessor } from '@/components/form';

type Value = string | number | undefined;

export type Option<T extends Value> = [T, JSX.Element];

export interface Props<T extends Value> {
    /**
     * 是否启用单选按钮的图标
     */
    icon?: boolean;

    scheme?: Scheme;
    label?: JSX.Element;
    disabled?: boolean;
    readonly?: boolean;
    vertical?: boolean;
    accessor: Accessor<Value>;
    options: Array<Option<T>>;
    title?: string;

    checkedIcon?: string;
    uncheckedIcon?: string;
}

export default function Group<T extends Value> (props: Props<T>) {
    props = mergeProps({
        icon: true,
        checkedIcon: 'radio_button_checked',
        uncheckedIcon: 'radio_button_unchecked'
    }, props);
    const access = props.accessor;

    return <fieldset disabled={props.disabled} classList={{
        'radio-group': true,
        'field': true,
        [`scheme--${props.scheme}`]: !!props.scheme
    }}>
        <Show when={props.label}>
            <legend class="icon-container" title={props.title}>{props.label}</legend >
        </Show>

        <div classList={{
            'content': true,
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
                                {access.getValue() === item[0] ? props.checkedIcon : props.uncheckedIcon }
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
