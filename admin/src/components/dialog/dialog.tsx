// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, Show } from 'solid-js';

import { useApp } from '@/app';
import { BaseProps } from '@/components/base';
import { Button } from '@/components/button';

/**
 * {@link Props#actions} 元素中的点击事件
 */
interface ClickFunc {
    /**
     * @returns 如果返回 false，将阻止对话框的关闭，其它值将关闭对话框将作为对话框的 returnValue 返回。
     * 需要注意 undefined 是一个有效果的关闭对话框返回值。
     */
    (): false | string | undefined;
}

export interface Methods {
    get open(): boolean;
    get returnValue(): string;
    close(returnValue: string): void;
    show(): void;
    showModal(): void;

    /**
     * 生成对话框上的按钮
     * @param title 按钮内容
     * @param click 点击事件
     */
    Action(title?: JSX.Element, click?: ClickFunc): JSX.Element;

    /**
     * 生成取消按钮的组件
     *
     * @param click 如果不为空，则在关闭对话框之前执行该方法，如果返回 false，则会中断关闭对话框。
     */
    CancelAction(click?: ClickFunc): JSX.Element;

    /**
     * 生成确定的按钮
     * @param click 点击事件
     */
    OKAction(click: ClickFunc): JSX.Element;
}

export interface Props extends BaseProps {
    ref: { (m: Methods): void };

    /**
     * 标题内容，如果此值不为空则同时会显示关闭按钮。
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
    const ctx = useApp();
    let ref: HTMLDialogElement;

    props.ref({
        get open() { return ref.open; },
        get returnValue() { return ref.returnValue; },
        close(returnValue: string) { ref.close(returnValue); },
        show() { ref.show(); },
        showModal() { ref.showModal(); },

        Action(title?: JSX.Element, click?: ClickFunc): JSX.Element {
            return <Button onClick={() => {
                if (click) {
                    const ret = click();
                    if (ret === false) { // undefined 也是关闭
                        return;
                    }
                    return ref.close(ret);
                }
                ref.close();
            }}>{title}</Button>;
        },

        CancelAction(click?: ClickFunc): JSX.Element {
            return this.Action(ctx.t('_i.cancel'), click);
        },

        OKAction(click?: ClickFunc): JSX.Element {
            return this.Action(ctx.t('_i.ok'), click);
        }
    });

    return <dialog class={props.class} ref={(el)=>ref=el} classList={{
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
