// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, Show } from 'solid-js';

import { BaseProps } from '@/components/base';

export interface Props extends BaseProps {
    ref: { (m: HTMLDialogElement): void };

    /**
     * 标题部分的内容，不包含关闭按钮。
     */
    header?: JSX.Element;

    /**
     * 底部的按钮，返回按钮组成的列表即可，不需要包含外层的元素，每个按钮需要自行处理关闭事件。
     *
     * 比如：
     * ```JSX
     * <>
     *     <button>cancel</button><button>ok</button>
     * </>
     * ```
     */
    actions?: JSX.Element;

    /**
     * 整个对话框的样式
     *
     * NOTE: 可能会与已有的样式有冲突。
     */
    class?: string;

    children: JSX.Element;
}

/**
 * 对话框组件
 *
 * 采用的是 html 标准中的 dialog 标签。
 */
export default function(props: Props) {
    let ref: HTMLDialogElement;
    return <dialog class={props.class} ref={(el) => { props.ref(el); ref = el; }} classList={{
        'c--dialog': true,
        [`palette--${props.palette}`]: !!props.palette
    }}>
        <Show when={props.header}>
            <header class="c--icon-container">
                {props.header}
                <span class="c--icon cursor-pointer" onClick={()=>ref.close('close')}>close</span>
            </header>
        </Show>

        <main>
            {props.children}
        </main>

        <Show when={props.actions}>
            <footer>{props.actions}</footer>
        </Show>
    </dialog>;
}
