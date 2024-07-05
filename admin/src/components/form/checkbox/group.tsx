// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { For, JSX, mergeProps, Show } from 'solid-js';

import { Color } from '@/components/base';
import { Accessor } from '@/components/form';
import { XCheckbox } from '.';

type Value = Array<string | number>;

export interface Props {
    color?: Color;
    label?: string;
    icon?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    vertical?: boolean;
    accessor: Accessor<Value>;
    options: Array<[Value[number], JSX.Element]>;
}

const defaultProps: Partial<Props> = { color: 'primary', icon: true };

export default function Group (props:Props) {
    props = mergeProps(defaultProps, props);
    const access = props.accessor;

    return <fieldset disabled={props.disabled} class={`field scheme--${props.color}`}>
        <Show when={props.label}>
            <legend>{props.label}</legend>
        </Show>

        <div classList={{
            'flex': true,
            'flex-col': props.vertical,
            'gap-1': true
        }}>
            <For each={props.options}>
                {(item) =>
                    <XCheckbox disabled={props.disabled} readonly={props.readonly} icon={props.icon} label={item[1]}
                        checked={access.getValue().find((v)=>v===item[0]) ? true : false}
                        onChange={(v)=>{
                            if (v) {
                                access.setValue([...access.getValue(), item[0]]);
                            } else {
                                access.setValue([...access.getValue().filter((v)=>v!==item[0])]);
                            }
                            access.setError();
                        }}
                    />
                }
            </For>
        </div>
        <p class="field_error" role="alert">{access.getError()}</p>
    </fieldset>;
}
