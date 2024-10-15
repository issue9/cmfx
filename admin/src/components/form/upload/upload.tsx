// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, createSignal, For, JSX, mergeProps, onMount, Show } from 'solid-js';

import { useApp } from '@/app/context';
import { Accessor } from '@/components/form';
import { Props as BaseProps } from '@/components/form/types';
import { PreviewFile, PreviewURL } from './preview';

export interface Ref {
    pick(): Promise<File>
    upload(): Promise<void>
}

export interface Props extends BaseProps {
    /**
     * 上传的地址，是相对于 api#baseURL 的地址
     */
    action: string;

    /**
     * 是否多选
     */
    multiple?: boolean;

    /**
     * 是否接受直接拖入文件
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
     * 支持的文件列表，同 https://developer.mozilla.org/zh-CN/docs/Web/HTML/Attributes/accept，但改为数组类型。
     */
    accept?: Array<string>;

    accessor: Accessor<Array<string>>;

    /**
     * 子项的宽度
     */
    itemSize?: string;

    /**
     * 在上传之前触发的事件，等同于 Input.change 事件。
     */
    before?: JSX.InputHTMLAttributes<HTMLInputElement>['onchange'];

    /**
     * 每个文件上传成功时触发的事件
     */
    success?: { (url: string): void; };

    /**
     * 每个文件上传失败时触发的事件
     */
    error?: { (err: any, name: string): void; };

    ref?: { (el: Ref): void; }
}

const presetProps: Readonly<Partial<Props>> = {
    itemSize: '72px',
};

export default function(props: Props): JSX.Element {
    const ctx = useApp();

    props = mergeProps(presetProps, props);
    const access = props.accessor;


    let dropRef: HTMLDivElement;
    let inputRef: HTMLInputElement;

    const [unupload, setUnupload] = createSignal<Array<File>>([]);

    const addAndUpload = ()=>{
        // TODO
    };

    const add = () => {
        inputRef.click();
        inputRef.addEventListener('change', ()=>{
            if (!inputRef.files || inputRef.files.length === 0) {
                return;
            }

            const files: Array<File> = [];
            for(var i = 0; i< inputRef.files.length; i++) {
                files.push(inputRef.files.item(i)!);
            }
            setUnupload((prev)=>{return [...prev, ...files];});
        });
    };

    const upload = async() => {
        for(const item of unupload()) {
            const data = new FormData();
            data.append(item.name, item);
            const ret = await ctx.api.upload(props.action, data);
            if (!ret.ok) {
                ctx.outputProblem(ret.status, ret.body);
                continue;
            }

            access.setValue([...access.getValue(), ret.body]);
        }

        // 清空未上传内容
        setUnupload([]);
    };

    onMount(()=>{
        if (!props.droppable) {
            return;
        }

        dropRef.addEventListener('dragover', (e)=>{
            e.preventDefault();
        });
        dropRef.addEventListener('dragleave',(e)=>{
            e.preventDefault();
        });

        dropRef.addEventListener('drop', (e)=>{
            e.preventDefault();

            if (!e.dataTransfer) { return; }

            const list = e.dataTransfer.files;
            if (list.length === 0) { return; }

            setUnupload((prev)=>{
                return [...prev, ...list];
            });
        });
    });

    if (props.ref) {
        props.ref({
            pick(): Promise<File> {
                // TODO
            },

            upload(): Promise<void> {
                // TODO
            }
        });
    }

    const size = createMemo((): JSX.CSSProperties => {
        return { 'height': props.itemSize, 'width': props.itemSize };
    });

    return <fieldset disabled={props.disabled} class={props.class} classList={{
        ...props.classList,
        'c--upload': true,
        'c--field': true,
        [`palette--${props.palette}`]: !!props.palette,
    }}>
        <div>
            {props.label}
            <input type="file" class="hidden" multiple={props.multiple} ref={el=>inputRef=el} />

            <div ref={el=>dropRef=el} classList={{
                'content': true,
            }}>
                <For each={access.getValue()}>
                    {(item)=>(
                        <PreviewURL size={props.itemSize!} url={item} del={()=>{
                            access.setValue(access.getValue().filter((v) => v !== item));
                        }} />
                    )}
                </For>

                <For each={unupload()}>
                    {(item) => {
                        return <PreviewFile size={props.itemSize!} file={item} del={()=>{
                            setUnupload(() => { return unupload().filter((v) => v.name !== item.name); });
                        }} />;
                    }}
                </For>
                <Show when={props.auto}>
                    <button style={size()} class={'c--icon action' + (props.reverse ? ' start' : '') } onClick={addAndUpload}>upload_file</button>
                </Show>
                <Show when={!props.auto}>
                    <button style={size()} class={'c--icon action' + (props.reverse ? ' start' : '') } onClick={add}>add</button>
                    <button style={size()} class={'c--icon action' + (props.reverse ? ' start' : '') } disabled={unupload().length===0} onClick={upload}>upload</button>
                </Show>
            </div>
        </div>

        <Show when={access.hasError()}>
            <p class="field_error" role="alert">{access.getError()}</p>
        </Show>
    </fieldset>;
}
