// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { BaseProps } from '@/components/base';

export interface Props extends BaseProps {
    ref: { (m: HTMLDialogElement): void };

    children: JSX.Element;
}

/**
 * 对话框组件
 *
 * 采用的是 html 标准中的 dialog 标签。
 */
export default function(props: Props) {
    return <dialog ref={(el)=>props.ref(el)} classList={{
        'c--dialog':true,
        [`palette--${props.palette}`]: !!props.palette
    }}>
        {props.children}
    </dialog>;
}
