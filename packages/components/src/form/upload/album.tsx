// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createMemo, For, JSX, mergeProps, onMount, Show } from 'solid-js';
import IconAdd from '~icons/material-symbols/add';
import IconUpload from '~icons/material-symbols/upload';
import IconUploadFile from '~icons/material-symbols/upload-file';

import { joinClass } from '@components/base';
import { Accessor, calcLayoutFieldAreas, Field, fieldArea2Style, FieldHelpArea, useForm } from '@components/form/field';
import { PreviewFile, PreviewURL } from './preview';
import styles from './style.module.css';
import { Props as BaseProps, Ref, Upload } from './upload';

export interface Props extends Omit<BaseProps,'dropzone'|'ref'> {
    /**
     * 是否接受直接拖入文件
     *
     * 非响应式的属性
     */
    droppable?: boolean;

    /**
     * 是否自动执行上传操作
     */
    auto?: boolean;

    /**
     * 逆向显示内容，这将会导致上传按钮显示在最前面。
     *
     * NOTE: 非响应式属性
     */
    reverse?: boolean;

    /**
     * 保存着所有已经上传的文件列表
     */
    accessor: Accessor<Array<string>>;

    /**
     * 子项的宽度
     */
    itemSize?: string;

    rounded?: boolean;
}

const presetProps: Readonly<Partial<Props>> = {
    itemSize: '72px',
};

export function Album(props: Props): JSX.Element {
    const form = useForm();
    props = mergeProps(presetProps, form, props);
    const access = props.accessor;

    let rootRef: HTMLDivElement;
    let dropRef: HTMLFieldSetElement;
    let uploadRef: Ref;

    onMount(()=>{
        if (!props.droppable) {
            dropRef.addEventListener('dragover', (e)=>{
                e.dataTransfer!.dropEffect = 'none';
                e.preventDefault();
            });
            return;
        }
    });

    createEffect(() => {
        rootRef.ariaDisabled = props.disabled ? 'true' : 'false';
        rootRef.ariaReadOnly = props.readonly ? 'true' : 'false';
    });

    const size = createMemo((): JSX.CSSProperties => {
        return { 'height': props.itemSize, 'width': props.itemSize };
    });

    const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, props.hasHelp, !!props.label));
    return <Field class={props.class} style={props.style} ref={el => rootRef = el}
        title={props.title} palette={props.palette}
    >
        <Show when={areas().labelArea}>
            {area => <label style={{
                ...fieldArea2Style(area()),
                'width': props.labelWidth,
                'text-align': props.labelAlign,
            }}>{props.label}</label>}
        </Show>

        <fieldset style={fieldArea2Style(areas().inputArea)} ref={el => dropRef = el} class={styles['upload-content']}>
            <Upload ref={el => uploadRef = el}
                upload={props.upload}
                fieldName={props.fieldName}
                multiple={props.multiple}
                accept={props.accept}
                dropzone={dropRef!} />

            <For each={access.getValue()}>
                {item => (
                    <PreviewURL size={props.itemSize!} url={item} del={() => {
                        access.setValue(access.getValue().filter((v) => v !== item));
                    }} />
                )}
            </For>

            <For each={uploadRef!.files()}>
                {(item, index) => {
                    return <PreviewFile size={props.itemSize!} file={item} del={() => {
                        uploadRef.delete(index());
                    }} />;
                }}
            </For>
            <Show when={props.auto && (props.multiple || (access.getValue().length + uploadRef!.files().length) === 0)}>
                <button disabled={props.disabled} style={size()} class={joinClass(undefined, styles.action, props.reverse ? styles.start : '')}
                    onClick={async () => {
                        uploadRef.pick();
                        await uploadRef.upload();
                    }}><IconUploadFile /></button>
            </Show>
            <Show when={!props.auto}>
                <Show when={(props.multiple || (access.getValue().length + uploadRef!.files().length) === 0)}>
                    <button disabled={props.disabled} style={size()} class={joinClass(undefined, styles.action, props.reverse ? styles.start : '')}
                        onClick={() => uploadRef.pick()}><IconAdd /></button>
                </Show>
                <Show when={uploadRef!.files().length > 0}>
                    <button disabled={props.disabled} style={size()} class={joinClass(undefined, styles.action, props.reverse ? styles.start : '')}
                        onClick={() => uploadRef!.upload()}><IconUpload /></button>
                </Show>
            </Show>
        </fieldset>

        <Show when={areas().helpArea}>
            {area => <FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
        </Show>
    </Field>;
}
