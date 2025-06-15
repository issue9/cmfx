// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createUniqueId, JSX, mergeProps } from 'solid-js';

import { Layout } from '@/base';
import { Accessor, calcLayoutFieldAreas, Field, FieldBaseProps, InputMode } from '@/form/field';
import styles from './style.module.css';

type Value = string | number | Array<string>;

export interface Props<T> extends FieldBaseProps {
    placeholder?: string;
    accessor: Accessor<T>;
    inputMode?: InputMode;
}

/**
 * 多行文本框
 *
 * @template T 文本框内容的类型
 */
export function TextArea<T extends Value>(props: Props<T>):JSX.Element {
    props = mergeProps({
        type:'text',
        layout: 'horizontal' as Layout,
    }, props) as Props<T>; // 指定默认值
    const access = props.accessor;
    const id = createUniqueId();

    return <Field class={props.class}
        {...calcLayoutFieldAreas(props.layout!)}
        help={props.help}
        hasHelp={access.hasHelp}
        getError={access.getError}
        title={props.title}
        label={<label for={id}>{props.label}</label>}
        palette={props.palette}>
        <textarea id={id} class={styles.textarea} inputMode={props.inputMode} tabIndex={props.tabindex} disabled={props.disabled} readOnly={props.readonly} placeholder={props.placeholder}
            value={access.getValue()}
            onInput={(e) => { access.setValue(e.target.value as T); access.setError(); }} />
    </Field>;
}
