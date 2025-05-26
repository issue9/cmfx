// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { CancelMovable, movable } from '@cmfx/core';
import { JSX, onCleanup, onMount, Show } from 'solid-js';

import { BaseProps, Locale } from '@/base';
import { Button } from '@/button';
import { useLocale } from '@/context';
import { Icon } from '@/icon';

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

export interface Ref extends HTMLDialogElement {
    /**
     * 移动对话框的位置
     *
     * @param p 如果为 undefined，那么将会剧中显示，否则显示在指定位置。
     */
    move(p?: { x: number | string, y: number | string }): void;

    /**
     * 生成对话框上的按钮
     *
     * @param title 按钮内容；
     * @param click 点击事件；
     * @param def 是否为默认按钮，如果是则会响应回车事件；
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

    /**
     * 是否是可拖拽移动的
     */
    movable?: boolean;

    children: JSX.Element;
}

function buildRef(ref: HTMLDialogElement, l: Locale): Ref {
    return Object.assign(ref, {
        move(p?: { x: number | string, y: number | string }): void {
            if (!p) {
                ref.style.left = '50%';
                ref.style.top = '50%';
                ref.style.translate = 'var(--tw-translate-x) var(--tw-translate-y)';
                return;
            }
    
            ref.style.translate = '0px 0px';
            ref.style.left = typeof p.x === 'string' ? p.x : p.x.toString() + 'px';
            ref.style.top = typeof p.y === 'string' ? p.y : p.y.toString() + 'px';
        },
    
        Action(title?: JSX.Element, click?: ClickFunc, def?: boolean): JSX.Element {
            const btnClick = async () => {
                if (click) {
                    const ret = await click();
                    if (ret === false) { return; } // false 阻止关闭
                    return ref.close(ret);
                }
                return ref.close(''); // dialog 常驻，需要取消上一次的 returnValue 值。
            };
    
            if (def) {
                const handler = async (e: KeyboardEvent) => {
                    if (e.key === 'Enter' && e.target === ref) {
                        await btnClick();
                    }
                };
    
                onMount(() => {
                    ref.addEventListener('keydown', handler);
                });
                onCleanup(() => {
                    ref.removeEventListener('keydown', handler);
                });
            }
            return <Button type={def ? 'submit' : 'button'} palette={def ? 'primary' : 'secondary'} onClick={btnClick}>{title}</Button>;
        },
    
        CancelAction(click?: ClickFunc): JSX.Element {
            return this.Action(l.t('_i.cancel'), click);
        },
    
        OKAction(click?: ClickFunc): JSX.Element {
            return this.Action(l.t('_i.ok'), click, true);
        },
    
        DefaultActions(ok: ClickFunc, cancel?: ClickFunc): JSX.Element {
            return <>
                {this.CancelAction(cancel)}
                {this.OKAction(ok)}
            </>;
        }
    });
}

/**
 * 对话框组件
 *
 * 采用的是 html 标准中的 dialog 标签。
 */
export function Dialog(props: Props): JSX.Element {
    const l = useLocale();
    let ref: HTMLDialogElement;

    let toolbar: HTMLElement;
    let cancel: CancelMovable;
    
    const dialogToggle = () => { // movable 需要容器牌可见状态，否则宽度不固定。
        if (!cancel && ref.open) { cancel = movable(toolbar, ref); }
    };
    onMount(() => {
        if (props.movable) {
            ref.addEventListener('toggle', dialogToggle);
        }
    });
    onCleanup(() => {
        cancel && cancel();
        ref.removeEventListener('toggle', dialogToggle);
    });

    return <dialog class={props.class} ref={(el) => { props.ref(buildRef(el, l)); ref = el; }} classList={{
        'c--dialog': true,
        [`palette--${props.palette}`]: !!props.palette
    }}>
        <Show when={props.header}>
            <header ref={el => toolbar = el}>
                {props.header}
                <Icon class="close" icon="close" onClick={()=>ref.close('close')} />
            </header>
        </Show>

        <main>{props.children}</main>

        <Show when={props.actions}>
            <footer>{props.actions}</footer>
        </Show>
    </dialog>;
}
