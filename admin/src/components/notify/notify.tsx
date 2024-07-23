// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, createUniqueId, For, Show } from 'solid-js';

import { BaseProps, Palette } from '@/components/base';
import { notify, sleep } from '@/core';

export interface Props extends BaseProps {
    ref: { (n: Sender): void };
    system?: boolean;
    icon?: string;
}

/**
 * 由 {@link Props#ref} 外放的发送通知接口
 */
export interface Sender {
    /**
     * 发送一条通知给用户
     *
     * @param title 标题；
     * @param body 具体内容，如果为空则只显示标题；
     * @param type 类型，仅对非系统通知的情况下有效；
     * @param timeout 如果大于 0，超过此秒数时将自动关闭提法；
     */
    send(title: string, body?: string,locale?: string, type?: Type, timeout?: number): Promise<void>;
}

export type Type = 'error' | 'warning' | 'success' | 'info';

export const type2Palette = new Map<Type, Palette>([
    ['error', 'error'],
    ['warning', 'tertiary'],
    ['success', 'primary'],
    ['info', 'secondary'],
]);

interface Message {
    palette?: Palette;
    title: string;
    body?: string;
    id: string;
    timeout?: number;
}

export default function(props: Props) {
    const [msgs, setMsgs] = createSignal<Array<Message>>([]);
    const delMsg = (id: string) => {
        setMsgs((prev) => {
            return [...prev.filter((n) => { return n.id !== id; })];
        });
    };

    props.ref({
        async send(title: string, body?: string, locale?: string, type?: Type, timeout?: number) {
            if (props.system && await notify(title, body, props.icon, locale, timeout)) {
                return;
            }

            const id = createUniqueId();
            let palette: Palette | undefined;
            if (type) { palette = type2Palette.get(type); }
            setMsgs((prev) => [...prev, { title, body, type, id, timeout, palette: palette }]);
        }
    });

    return <div class={props.palette ? `notify palette--${props.palette}` : 'notify'}>
        <For each={msgs()}>
            {item => {
                const elemID = `notify-${item.id}`;

                const del = () => { // 删除通知，并通过改变 height 触发动画效果。
                    const elem = document.getElementById(elemID);
                    if (!elem) { // 已经删除
                        return;
                    }

                    elem!.style.height = '0px';
                    sleep(100).then(() => { delMsg(item.id); });
                };

                if (item.timeout && item.timeout > 0) { // 存在自动删除功能
                    sleep(1000 * item.timeout).then(() => { del(); });
                }

                return <div id={elemID} role="alert" class={item.palette ? `message palette--${item.palette}` : 'message'}>
                    <div class="title">
                        <p>{item.title}</p>
                        <button onClick={() => del()} class="close">close</button>
                    </div>
                    <Show when={item.body}>
                        <hr />
                        <p class="p-3">{item.body}</p>
                    </Show>
                </div>;
            }}
        </For>
    </div>;
}
