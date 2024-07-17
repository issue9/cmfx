// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, Show } from 'solid-js';

import { renderElementProp } from '@/components/base';
import { Accessor, FieldBaseProps } from '@/components/form';

export interface Props extends FieldBaseProps {
    icon?: string;
    min?: number,
    max?: number,
    step?: number,
    placeholder?: string;
    rounded?: boolean;
    accessor: Accessor<number>;
}

const defaultProps: Partial<Props> = {
    step: 1,
};

export default function(props: Props): JSX.Element {
    props = mergeProps(defaultProps, props);

    const access = props.accessor;

    const step = (v: number) => {
        if (props.readonly || props.disabled) {
            return;
        }

        access.setValue(access.getValue() + v);
        access.setError();
    };

    return <div class={props.scheme ? `field scheme--${props.scheme}` : 'field'}>
        <label title={props.title}>
            <Show when={props.label}>
                {renderElementProp(props.label)}
            </Show>

            <div classList={{
                'number': true,
                'rounded-full': props.rounded,
            }}>
                <Show when={props.icon}>
                    <span role="none" class="material-symbols-outlined">{props.icon}</span>
                </Show>
                <input type='number' disabled={props.disabled} readOnly={props.readonly} placeholder={props.placeholder}
                    min={props.min} max={props.max}
                    value={access.getValue()}
                    onInput={(e) => { access.setValue(parseInt(e.target.value)); access.setError(); }}
                />
                <button disabled={props.disabled} class="tail material-symbols-outlined" onClick={()=>step(props.step!)}>arrow_drop_up</button>
                <button disabled={props.disabled} class="tail material-symbols-outlined" onClick={()=>step(-props.step!)}>arrow_drop_down</button>
            </div>
        </label>

        <Show when={access.hasError()}>
            <p class="field_error" role="alert">{access.getError()}</p>
        </Show>
    </div>;
}
