// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import type { QuillOptions, } from 'quill';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { createEffect, createUniqueId, JSX, onMount } from 'solid-js';

import { classList } from '@/base';
import { Accessor, calcLayoutFieldAreas, Field, FieldBaseProps } from '@/form/field';
import styles from './style.module.css';

export interface Props extends FieldBaseProps {
    placeholder?: string;
    accessor: Accessor<string>;
}

/**
 * WYSIWYG 编辑器
 */
export function Editor(props: Props): JSX.Element {
    if (props.layout === undefined) { props.layout = 'horizontal'; }

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

    return <Field class={classList(props.classList, styles.editor, props.class)}
        {...calcLayoutFieldAreas(props.layout!)}
        help={props.help}
        hasHelp={props.accessor.hasHelp}
        getError={props.accessor.getError}
        title={props.title}
        label={<label onClick={()=>editor.focus()}>{props.label}</label>}
        palette={props.palette}
        aria-haspopup
    >
        <div ref={el => ref = el} id={'editor-' + createUniqueId()}></div>
    </Field>;
}
