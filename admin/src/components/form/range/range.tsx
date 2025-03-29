// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Accessor, Field, FieldBaseProps } from '@/components/form/field';

export interface Props extends FieldBaseProps {
    /**
     * 最小值
     */
    min?: number;

    /**
     * 最大值
     */
    max?: number;

    step?: number;

    marks?: Array<[value: number, title: string]>;

    horizontal?: boolean;

    accessor: Accessor<number>;
}

/**
 * 相当于 <input type="range" />
 */
export default function Range(props: Props): JSX.Element {
    const access = props.accessor;

    return <Field class={props.class}
        inputArea={{ pos: 'middle-center' }}
        helpArea={{ pos: 'bottom-center' }}
        labelArea={{ pos: props.horizontal ? 'middle-left' : 'top-center' }}
        classList={props.classList}
        help={props.help}
        hasHelp={access.hasHelp}
        getError={access.getError}
        title={props.title}
        label={props.label}
        palette={props.palette}
    >
        <input class="c--range" type="range" min={props.min} max={props.max} step={props.step} value={access.getValue()}
            readOnly={props.readonly} disabled={props.disabled} name={access.name()} onChange={(e) => {
                if (!props.readonly && !props.disabled) {
                    let v = parseFloat(e.target.value);
                    access.setValue(v);
                    access.setError();
                }
            }}
        />
    </Field>;
}