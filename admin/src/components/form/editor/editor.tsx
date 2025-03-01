// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import type { QuillOptions, } from 'quill';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { createEffect, createUniqueId, JSX, onMount, Show } from 'solid-js';

import { Accessor, FieldBaseProps } from '@/components/form';

export interface Props extends FieldBaseProps {
    placeholder?: string;
    accessor: Accessor<string>;
}

/**
 * WYSIWYG 编辑器
 */
export function Editor(props: Props): JSX.Element {
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

    return <label accessKey={props.accessKey} onClick={() => editor.focus()} class={props.class} classList={{
        ...props.classList,
        'c--editor': true,
        [`palette--${props.palette}`]: !!props.palette
    }}>
        <Show when={props.label}>{props.label}</Show>

        <div ref={el=>ref=el} id={'editor-' + createUniqueId()} class="h-full"></div>

        <Show when={props.accessor.hasError()}>
            {props.accessor.getError()}
        </Show>
    </label>;
}
