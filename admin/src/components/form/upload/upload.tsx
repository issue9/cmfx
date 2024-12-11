// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, JSX, onMount } from 'solid-js';

import { useApp } from '@/app/context';
import { Props as BaseProps } from '@/components/form/types';

/**
 * 上传组件的外放接口
 */
export interface Ref {
    /**
     * 显示文件选取对话框，如果有选择文件的话，还自动添加至 {@link Ref#files} 中。
     */
    pick(): void;

    /**
     * 返回所有未上传的文件
     */
    files(): Array<File>;

    /**
     * 删除 {@link Ref#files} 中的第 index 对象
     */
    delete(index: number): void;

    /**
     * 清除所有未上传的内容
     */
    clear(): void;

    /**
     * 上传 {@link Ref#files} 中的文件
     */
    upload(): Promise<Array<string>|undefined>;
}

export interface Props extends BaseProps {
    /**
     * 上传文件在表单中的名称
     */
    fieldName: string;

    /**
     * 上传的地址，是相对于 api#baseURL 的地址
     */
    action: string;

    /**
     * 是否多选
     *
     * 非响应式属性
     */
    multiple?: boolean;

    /**
     * 支持的文件列表，同 https://developer.mozilla.org/zh-CN/docs/Web/HTML/Attributes/accept，但改为数组类型。
     */
    accept?: Array<string>;

    ref: { (el: Ref): void; }

    /**
     * 指定一个接受拖拖拽文件的区域
     */
    dropzone?: HTMLElement;
}

/**
 * 提供了文件上传组件的基本功能，但是并未提供对应的 UI 功能。
 */
export function Upload(props: Props): JSX.Element {
    const ctx = useApp();

    let inputRef: HTMLInputElement;
    const [files, setFiles] = createSignal<Array<File>>([]);

    /**
     * 将 fs 内的文件添加至 unupload
     */
    const add = (fs: FileList | null) => {
        if (!fs || fs.length === 0) {
            return;
        }

        if (!props.multiple) {
            setFiles([fs.item(0)!]);
            return;
        }

        const newFiles: Array<File> = [];
        for (var i = 0; i < fs.length; i++) {
            newFiles.push(fs.item(i)!);
        }
        setFiles((prev) => { return [...prev, ...newFiles]; });
    };

    onMount(() => {
        inputRef.addEventListener('change', (e) => {
            const target = e.target as HTMLInputElement;
            add(target.files);
        });

        if (props.dropzone) {
            props.dropzone.addEventListener('dragover', (e) => {
                e.dataTransfer!.dropEffect = 'copy';
                e.preventDefault();
            });

            props.dropzone.addEventListener('dragleave', (e) => {
                e.preventDefault();
            });

            props.dropzone.addEventListener('drop', (e) => {
                e.preventDefault();

                if (e.dataTransfer) {
                    add(e.dataTransfer.files);
                }
            });
        }
    });

    props.ref({
        pick(): void { inputRef.click(); },

        files(): Array<File> { return files(); },

        delete(index: number): void {
            setFiles((prev) => {
                prev.splice(index, 1);
                return [...prev];
            });
        },

        clear(): void { setFiles([]); },

        async upload(): Promise<Array<string> | undefined> {
            const data = new FormData();
            for (const item of files()) {
                data.append(props.fieldName, item);
            }

            const ret = await ctx.api.upload<Array<string>>(props.action, data);
            if (!ret.ok) {
                await ctx.outputProblem(ret.body);
                return;
            }

            setFiles([]);
            return ret.body;
        }
    });

    return <input type="file" class="hidden" name={props.fieldName} multiple={props.multiple} ref={el => inputRef = el} />;
}
