// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, For, JSX, mergeProps, onMount, Show } from 'solid-js';

import { Accessor, Field } from '@/form/field';
import { PreviewFile, PreviewURL } from './preview';
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
    props = mergeProps(presetProps, props);
    const access = props.accessor;

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

    const size = createMemo((): JSX.CSSProperties => {
        return { 'height': props.itemSize, 'width': props.itemSize };
    });
    
    return <Field class={props.class}
        inputArea={{ pos: 'middle-center' }}
        helpArea={{ pos: 'bottom-center' }}
        labelArea={{ pos: props.layout ==='horizontal' ? 'middle-left' : 'top-center' }}
        classList={props.classList}
        hasHelp={access.hasHelp}
        help={props.help}
        getError={access.getError}
        title={props.title}
        label={props.label}
        palette={props.palette}
    >
        <fieldset ref={el => dropRef = el} class="c--upload-content">
            <Upload ref={el => uploadRef = el}
                fieldName={props.fieldName}
                multiple={props.multiple}
                action={props.action}
                accept={props.accept}
                dropzone={dropRef!} />

            <For each={access.getValue()}>
                {(item) => (
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
                <button style={size()} class={'c--icon action' + (props.reverse ? ' start' : '')} onClick={async () => {
                    uploadRef.pick();
                    await uploadRef.upload();
                }}>upload_file</button>
            </Show>
            <Show when={!props.auto}>
                <Show when={(props.multiple || (access.getValue().length + uploadRef!.files().length) === 0)}>
                    <button style={size()} class={'c--icon action' + (props.reverse ? ' start' : '')} onClick={() => uploadRef.pick()}>add</button>
                </Show>
                <Show when={uploadRef!.files().length > 0}>
                    <button style={size()} class={'c--icon action' + (props.reverse ? ' start' : '')} onClick={() => uploadRef!.upload()}>upload</button>
                </Show>
            </Show>
        </fieldset>
    </Field>;
}
