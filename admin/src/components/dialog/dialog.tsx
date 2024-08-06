// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, onMount } from 'solid-js';

import { BaseProps } from '@/components/base';

export interface Props extends BaseProps {
    ref: { (m: Methods): void };

    children: JSX.Element;
}

/**
 * 对话框基本接口
 */
export interface Methods {
    /**
     * 关闭对话框
     * @param returnValue 返回给对话框的值
     */
    close(returnValue?: string | number): void;

    show(): void;

    showModal(): void;
}

/**
 * 对话框组件
 *
 * 采用的是 html 标准中的 dialog 标签。
 */
export default function(props: Props) {
    let ref: HTMLDialogElement;

    onMount(() => {
        props.ref(ref!);
    });

    return <dialog ref={(el)=>ref=el} classList={{
        'c--dialog':true,
        [`palette--${props.palette}`]: !!props.palette
    }}>
        {props.children}
    </dialog>;
}
