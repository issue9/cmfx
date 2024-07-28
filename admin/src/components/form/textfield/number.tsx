// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps, Show } from 'solid-js';

import { renderElementProp } from '@/components/base';
import { Accessor, FieldBaseProps, InputMode } from '@/components/form';

export interface Props extends FieldBaseProps {
    icon?: string;
    min?: number,
    max?: number,
    step?: number,
    placeholder?: string;
    rounded?: boolean;
    accessor: Accessor<number>;

    /**
     * 默认为 decimal
     */
    inputMode?: InputMode;
}

const defaultProps: Partial<Props> = {
    step: 1,
    inputMode: 'decimal'
};

export default function(props: Props): JSX.Element {
    props = mergeProps(defaultProps, props);

    if (props.step === 0) {
        throw 'step 不能为零';
    }

    const access = props.accessor;

    const step = (v: number) => {
        if (props.readonly || props.disabled) {
            return;
        }

        const n = access.getValue() + v;
        if (props.min !== undefined && v < 0 && n < props.min) {
            return;
        }
        if (props.max !== undefined && v > 0 && n > props.max) {
            return;
        }

        access.setValue(access.getValue() + v);
        access.setError();
    };

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
                <input class="input" type='number' inputMode={props.inputMode} disabled={props.disabled} readOnly={props.readonly} placeholder={props.placeholder}
                    tabIndex={props.tabindex}
                    min={props.min} max={props.max}
                    value={access.getValue()}
                    onInput={(e) => { access.setValue(parseInt(e.target.value)); access.setError(); }}
                />
                <button disabled={props.disabled} class="btn material-symbols-outlined" onClick={()=>step(props.step!)}>arrow_drop_up</button>
                <button disabled={props.disabled} class="btn material-symbols-outlined" onClick={()=>step(-props.step!)}>arrow_drop_down</button>
            </div>
        </label>

        <Show when={access.hasError()}>
            <p class="field_error" role="alert">{access.getError()}</p>
        </Show>
    </div>;
}
