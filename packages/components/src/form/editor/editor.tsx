// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import type { QuillOptions } from 'quill';
import Quill from 'quill';
import 'quill/dist/quill.bubble.css';
import 'quill/dist/quill.snow.css';
import { createEffect, createMemo, createUniqueId, JSX, mergeProps, onMount, Show } from 'solid-js';

import { joinClass, RefProps } from '@/base';
import {
    Accessor, calcLayoutFieldAreas, Field, fieldArea2Style, FieldBaseProps, FieldHelpArea, useForm
} from '@/form/field';
import styles from './style.module.css';

export interface Ref {
    /**
     * 组件根元素
     */
    element(): HTMLDivElement;

    /**
     * 向外暴露的 quill 对象
     */
    quill(): Quill;
}

export interface Props extends Omit<FieldBaseProps, 'rounded'>, RefProps<Ref> {
    /**
     * 简单样式
     *
     * @remarks 如果为 true，将使用 bubble 主题，否则使用 snow 主题。
     */
    simple?: boolean;

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
        theme: props.simple ? 'bubble' : 'snow',

        modules: {
            clipboard: true,
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],

                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }, 'blockquote', 'code-block'],
                ['link', 'image', 'video'],
            ],
            history: true,
        },
        formats: [
            'header', 'list',
            'bold', 'italic', 'underline', 'strike',
            'color', 'background', 'blockquote', 'code-block',
            'link', 'image', 'video'
        ],

        placeholder: props.placeholder,
        readOnly: props.readonly
    };

    let root: HTMLDivElement;
    let ref: HTMLDivElement;
    let editor: Quill;
    onMount(() => {
        editor = new Quill(ref, options);

        editor.on(Quill.events.TEXT_CHANGE, () => {
            props.accessor.setValue(editor.getSemanticHTML());
            props.accessor.setError();
        });
    });

    createEffect(() => { // 监视状态变化
        const d = props.disabled;
        const r = props.readonly;
        if (editor) { editor.enable(!d && !r); }

        root.ariaReadOnly = props.readonly ? 'true' : 'false';
        root.ariaDisabled = props.disabled ? 'true' : 'false';
    });

    props.accessor.onChange(txt => { // 监视外部变化
        if (!editor || txt === editor.getSemanticHTML()) { return; }
        editor.clipboard.dangerouslyPasteHTML(txt);
        editor.setSelection(editor.getLength()); // 光标定位末尾
    });

    const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, props.hasHelp, !!props.label));
    return <Field class={joinClass(undefined, styles.editor, props.class)}
        style={props.style} title={props.title} palette={props.palette} ref={el => {
            root = el;

            if (!props.ref) { return; }
            props.ref({
                element() { return el; },
                quill() { return editor; }
            });
        }}
    >
        <Show when={areas().labelArea}>
            {area => <label style={{
                ...fieldArea2Style(area()),
                'width': props.labelWidth,
                'text-align': props.labelAlign,
            }} onClick={() => editor.focus()}>{props.label}</label>}
        </Show>

        <div class={styles['editor-wrap']} style={fieldArea2Style(areas().inputArea)}>
            <div ref={el => ref = el} id={'editor-' + createUniqueId()} />
        </div>

        <Show when={areas().helpArea}>
            {area => <FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
        </Show>
    </Field>;
}
