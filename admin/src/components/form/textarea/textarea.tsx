// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, mergeProps } from 'solid-js';

import { Accessor, Field, FieldBaseProps, InputMode } from '@/components/form/field';
import { createUniqueId } from 'solid-js';

type Value = string | number | Array<string>;

export interface Props<T> extends FieldBaseProps {
    placeholder?: string;
    accessor: Accessor<T>;
    inputMode?: InputMode;
}

export function TextArea<T extends Value>(props: Props<T>):JSX.Element {
    props = mergeProps({type:'text'}, props) as Props<T>; // 指定默认值
    const access = props.accessor;
    const id = createUniqueId();

    return <Field class={props.class}
        inputArea={{ pos: 'middle-center' }}
        errArea={{ pos: 'bottom-center' }}
        labelArea={{ pos: props.horizontal ? 'middle-left' : 'top-center' }}
        classList={props.classList}
        hasError={access.hasError}
        getError={access.getError}
        title={props.title}
        label={<label for={id}>{props.label}</label>}
        palette={props.palette}>
        <textarea id={id} class="c--textarea" inputMode={props.inputMode} tabIndex={props.tabindex} disabled={props.disabled} readOnly={props.readonly} placeholder={props.placeholder}
            value={access.getValue()}
            onInput={(e) => { access.setValue(e.target.value as T); access.setError(); }} />
    </Field>;
}
