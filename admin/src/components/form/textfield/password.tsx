// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, Show } from 'solid-js';

import { renderElementProp } from '@/components/base';
import { Accessor, FieldBaseProps } from '@/components/form';
import { createSignal } from 'solid-js';

export interface Props extends FieldBaseProps {
    icon?: string;
    placeholder?: string;
    rounded?: boolean;
    accessor: Accessor<string>;
}

export default function(props: Props): JSX.Element {
    const access = props.accessor;
    const [visible, setVisible] = createSignal(false);
    let ref: HTMLInputElement;

    return <div class={props.palette ? `field palette--${props.palette}` : 'field'}>
        <label title={props.title}>
            <Show when={props.label}>
                {renderElementProp(props.label)}
            </Show>

            <div classList={{
                'c--text-field': true,
                'rounded': props.rounded,
            }}>
                <Show when={props.icon}>
                    <span role="none" class="prefix flex items-center pl-1 material-symbols-outlined">{props.icon}</span>
                </Show>
                <input ref={(el)=>ref=el} type="password" tabIndex={props.tabindex} class="input" disabled={props.disabled} readOnly={props.readonly} placeholder={props.placeholder}
                    value={access.getValue()}
                    onInput={(e) => { access.setValue(e.target.value); access.setError(); }}
                />
                <button disabled={props.disabled} class="suffix btn flex items-center pr-1 material-symbols-outlined"
                    onClick={() => {
                        setVisible(!visible());
                        ref.type = visible() ? 'text' : 'password';
                    }}>
                    {visible() ? 'visibility_off' : 'visibility'}
                </button>
            </div>
        </label>

        <Show when={access.hasError()}>
            <p class="field_error" role="alert">{access.getError()}</p>
        </Show>
    </div>;
}
