// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import type { QuillOptions, } from 'quill';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { createEffect, createMemo, createUniqueId, JSX, mergeProps, onMount, Show } from 'solid-js';

import { Accessor, calcLayoutFieldAreas, Field, fieldArea2Style, FieldBaseProps, FieldHelpArea, useForm } from '@/form/field';
import styles from './style.module.css';

export interface Props extends Omit<FieldBaseProps, 'rounded'> {
    placeholder?: string;

    /**
     * NOTE: 非响应式属性
     */
    accessor: Accessor<string>;
}

/**
 * WYSIWYG 编辑器
 */
export function Editor(props: Props): JSX.Element {
    const form = useForm();
    props = mergeProps(form, props);

    const options: QuillOptions = {
        theme: 'snow',

        modules: {
            toolbar: true
        },

        placeholder: props.placeholder,
        readOnly: props.readonly
    };

    let ref: HTMLDivElement;
    let editor: Quill;
    onMount(() => {
        editor = new Quill(ref, options);

        const delta = editor.clipboard.convert({ html: props.accessor.getValue() });
        editor.setContents(delta, 'api');

        editor.on(Quill.events.TEXT_CHANGE, () => {
            props.accessor.setValue(editor.getSemanticHTML());
            props.accessor.setError();
        });
    });

    createEffect(() => {
        if (editor) {
            editor.enable(!props.disabled && !props.readonly);
        }
    });

    const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, props.hasHelp, !!props.label));
    return <Field class={props.class} title={props.title} palette={props.palette}>
        <Show when={areas().labelArea}>
            {(area) => <label style={fieldArea2Style(area())} onClick={() => editor.focus()}>{props.label}</label>}
        </Show>

        <div class={styles.editor} style={fieldArea2Style(areas().inputArea)}>
            <div ref={el => ref = el} id={'editor-' + createUniqueId()} />
        </div>

        <Show when={areas().helpArea}>
            {(area) => <FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
        </Show>
    </Field>;
}
