// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { For, JSX, mergeProps, Show } from 'solid-js';

import { Accessor, FieldProps, Options } from '@/components/form/field';

export interface Props<T> extends FieldProps {
    /**
     * 是否显示为块
     */
    block?: boolean;

    vertical?: boolean;
    accessor: Accessor<T>;
    options: Options<T>;
}

export function RadioGroup<T extends string | number | undefined> (props: Props<T>): JSX.Element {
    props = mergeProps({
        tabindex: 0,
    }, props);
    const access = props.accessor;

    return <fieldset accessKey={props.accessKey} disabled={props.disabled} class={props.class} classList={{
        ...props.classList,
        'c--radio-group': true,
        'c--field': true,
        [`palette--${props.palette}`]: !!props.palette
    }}>
        <Show when={props.label}>
            <legend class="flex items-center w-full" title={props.title}>{props.label}</legend >
        </Show>

        <div classList={{
            'content': true,
            'flex-col': props.vertical
        }}>
            <For each={props.options}>
                {(item) =>
                    <label classList={{'border': props.block}} tabIndex={props.tabindex} accessKey={props.accessKey}>
                        <input type="radio" class={props.block ? '!hidden' : undefined}
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
