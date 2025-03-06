// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, onCleanup, onMount, Show } from 'solid-js';

import { BaseProps } from '@/components/base';
import { Button } from '@/components/button';
import { useApp } from '@/components/context';
import { Icon } from '@/components/icon';

/**
 * {@link Props#actions} 元素中的点击事件
 */
interface ClickFunc {
    /**
     * @returns 如果返回 false，将阻止对话框的关闭，其它值将关闭对话框将作为对话框的 returnValue 返回。
     * 需要注意 undefined 是一个有效果的关闭对话框返回值。
     */
    (): Promise<false | string | undefined>;
}

export interface Ref {
    get open(): boolean;
    get returnValue(): string;
    close(returnValue?: string): void;
    show(): void;
    showModal(): void;
    addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLDialogElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLDialogElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;

    /**
     * 生成对话框上的按钮
     *
     * @param title 按钮内容；
     * @param click 点击事件；
     * @param def 默认按钮，响应回车事件；
     */
    Action(title?: JSX.Element, click?: ClickFunc, def?: boolean): JSX.Element;

    /**
     * 生成取消按钮的组件
     *
     * @param click 如果不为空，则在关闭对话框之前执行该方法，如果返回 false，则会中断关闭对话框。
     */
    CancelAction(click?: ClickFunc): JSX.Element;

    /**
     * 生成确定的按钮
     *
     * @param click 点击事件
     */
    OKAction(click: ClickFunc): JSX.Element;

    /**
     * 生成带有确认和取消两个按钮的操作栏
     *
     * @param ok 确定按钮的事件
     * @param cancel 取消按钮的事件
     */
    DefaultActions(ok: ClickFunc, cancel?: ClickFunc): JSX.Element;
}

export interface Props extends BaseProps {
    ref: { (m: Ref): void };

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
export function Dialog(props: Props): JSX.Element {
    const ctx = useApp();
    let ref: HTMLDialogElement;

    props.ref({
        get open() { return ref.open; },
        get returnValue() { return ref.returnValue; },
        close(returnValue?: string) { ref.close(returnValue); },
        show() { ref.show(); },
        showModal() { ref.showModal(); },
        addEventListener<K extends keyof HTMLElementEventMap>(type: K|string, listener: (this: HTMLDialogElement, ev: HTMLElementEventMap[K]) => any|EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
            ref.addEventListener(type as any, listener, options);
        },
        removeEventListener<K extends keyof HTMLElementEventMap>(type: K|string, listener: (this: HTMLDialogElement, ev: HTMLElementEventMap[K]) => any|EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void {
            ref.removeEventListener(type as any, listener, options);
        },

        Action(title?: JSX.Element, click?: ClickFunc, def?: boolean): JSX.Element {
            const btnClick = async () => {
                if (click) {
                    const ret = await click();
                    if (ret === false) { // undefined 也是关闭
                        return;
                    }
                    return ref.close(ret);
                }
                ref.close();
            };

            if (def) {
                const handler = async (e: KeyboardEvent) => {
                    if (e.key === 'Enter' && e.target === ref) {
                        await btnClick();
                    }
                };

                const self = this;
                onMount(() => {
                    self.addEventListener('keydown', handler);
                });
                onCleanup(()=>{
                    self.removeEventListener('keydown', handler);
                });
            }
            return <Button type={def?'submit':'button'} palette={def?'primary':'secondary'} onClick={btnClick}>{title}</Button>;
        },

        CancelAction(click?: ClickFunc): JSX.Element {
            return this.Action(ctx.locale().t('_i.cancel'), click);
        },

        OKAction(click?: ClickFunc): JSX.Element {
            return this.Action(ctx.locale().t('_i.ok'), click, true);
        },

        DefaultActions(ok:ClickFunc, cancel?:ClickFunc): JSX.Element {
            return <>
                {this.CancelAction(cancel)}
                {this.OKAction(ok)}
            </>;
        }
    });

    return <dialog class={props.class} ref={(el)=>ref=el} classList={{
        'c--dialog': true,
        [`palette--${props.palette}`]: !!props.palette
    }}>
        <Show when={props.header}>
            <header>
                {props.header}
                <Icon class="cursor-pointer" icon="close" onClick={()=>ref.close('close')} />
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
