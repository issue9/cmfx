// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import type { QuillOptions, } from 'quill';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { createEffect, createUniqueId, onMount, Show } from 'solid-js';

import { renderElementProp } from '@/components/base';
import { Accessor, FieldBaseProps, InputMode } from '@/components/form';

export interface Props extends FieldBaseProps {
    placeholder?: string;
    accessor: Accessor<string>;
    inputMode?: InputMode;
    minHeight?: string;
}

/**
 * WYSIWYG 编辑器
 */
export default function(props: Props) {
    const id = 'editor-' + createUniqueId();

    const options: QuillOptions = {
        theme: 'snow',

        modules: {
            toolbar: true
        },

        placeholder: props.placeholder,
        readOnly: props.readonly
    };

    let editor: Quill;
    onMount(() => {
        editor = new Quill('#' + id, options);

        const delta = editor.clipboard.convert({ html: props.accessor.getValue() });
        editor.setContents(delta, 'api');

        editor.on(Quill.events.TEXT_CHANGE, () => {
            props.accessor.setValue(editor.getSemanticHTML());
            props.accessor.setError();
        });
    });

    createEffect(() => {
        editor.enable(!props.disabled && !props.readonly);
    });

    return <label accessKey={props.accessKey} onClick={()=>editor.focus()} classList={{
        'c--editor': true,
        [`palette--${props.palette}`]: !!props.palette
    }}>
        <Show when={props.label}>
            {renderElementProp(props.label)}
        </Show>

        <div id={id} style={{'min-height': props.minHeight}}></div>

        <Show when={props.accessor.hasError()}>
            {props.accessor.getError()}
        </Show>
    </label>;
}
