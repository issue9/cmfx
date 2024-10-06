// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { For, mergeProps, Show } from 'solid-js';

import { Accessor, FieldBaseProps, Options } from '@/components/form';

export interface Props<T> extends FieldBaseProps {
    /**
     * 是否显示为块
     */
    block?: boolean;

    vertical?: boolean;
    accessor: Accessor<T>;
    options: Options<T>;

    checkedIcon?: string;
    uncheckedIcon?: string;
}

export default function Group<T extends string | number | undefined> (props: Props<T>) {
    props = mergeProps({
        tabindex: 0,
        checkedIcon: 'radio_button_checked',
        uncheckedIcon: 'radio_button_unchecked'
    }, props);
    const access = props.accessor;

    return <fieldset accessKey={props.accessKey} disabled={props.disabled} classList={{
        'c--radio-group': true,
        'c--field': true,
        [`palette--${props.palette}`]: !!props.palette
    }}>
        <Show when={props.label}>
            <legend class="c--icon-container w-full" title={props.title}>{props.label}</legend >
        </Show>

        <div classList={{
            'content': true,
            'flex-col': props.vertical
        }}>
            <For each={props.options}>
                {(item) =>
                    <label classList={{'border': props.block}} tabIndex={props.tabindex} accessKey={props.accessKey}>
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
                        <Show when={!props.block}>
                            <span class="radio-icon c--icon">
                                {access.getValue() === item[0] ? props.checkedIcon : props.uncheckedIcon }
                            </span>
                        </Show>
                        {item[1]}
                    </label>
                }
            </For>
        </div>
        <Show when={access.hasError()}>
            <p class="field_error" role="alert">{access.getError()}</p>
        </Show>
    </fieldset>;
}
