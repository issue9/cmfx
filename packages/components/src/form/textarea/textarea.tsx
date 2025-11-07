// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, createUniqueId, JSX, mergeProps, Show } from 'solid-js';

import { joinClass } from '@/base';
import {
    Accessor, calcLayoutFieldAreas, Field, fieldArea2Style, FieldBaseProps, FieldHelpArea, useForm
} from '@/form/field';
import { InputMode } from '@/input';
import styles from './style.module.css';

type Value = string | number | Array<string>;

export interface Props<T extends Value> extends FieldBaseProps {
    placeholder?: string;

    /**
     * NOTE: 非响应式属性
     */
    accessor: Accessor<T>;

    inputMode?: InputMode;
}

/**
 * 多行文本框
 *
 * @typeParam T - 文本框内容的类型
 */
export function TextArea<T extends Value>(props: Props<T>):JSX.Element {
    const form = useForm();
    props = mergeProps(form, props);

    const access = props.accessor;
    const id = createUniqueId();
    const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, props.hasHelp, !!props.label));

    return <Field class={props.class} style={props.style} title={props.title} palette={props.palette}>
        <Show when={areas().labelArea}>
            {area => <label style={fieldArea2Style(area())} for={id}>{props.label}</label>}
        </Show>

        <textarea style={fieldArea2Style(areas().inputArea)} id={id} inputMode={props.inputMode}
            class={joinClass(undefined, styles.textarea, props.rounded ? styles.rounded : '')}
            tabIndex={props.tabindex} disabled={props.disabled} readOnly={props.readonly}
            placeholder={props.placeholder} value={access.getValue()}
            onInput={(e) => { access.setValue(e.target.value as T); access.setError(); }} />

        <Show when={areas().helpArea}>
            {(area) => <FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
        </Show>
    </Field>;
}
