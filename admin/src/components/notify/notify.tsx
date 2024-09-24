// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, createUniqueId, For, mergeProps, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import { BaseProps, Palette } from '@/components/base';
import { sleep } from '@/core';

export type Props = BaseProps;

const presetProps: Readonly<Partial<Props>> = {
    palette: 'error',
};

declare global {
    interface Window {
        /**
         * 发送一条通知给用户
         *
         * @param title 标题；
         * @param body 具体内容，如果为空则只显示标题；
         * @param type 类型，仅对非系统通知的情况下有效；
         * @param timeout 如果大于 0，超过此秒数时将自动关闭提法；
         */
        notify(title: string, body?: string, type?: Type, timeout?: number): Promise<void>;
    }
}

export const types = ['error', 'warning', 'success', 'info'] as const;

export type Type = typeof types[number];

export const type2Palette: ReadonlyMap<Type, Palette> = new Map<Type, Palette>([
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

/**
 * 通知组件
 *
 * NOTE: 该组件会在全局注册一个 {@link Window#notify} 方法。
 * 不应该多次调用，且尽可能早地调用该组件，以使 notify 方法处于可用状态。
 */
export default function(props: Props) {
    props = mergeProps(presetProps, props);

    const [msgs, setMsgs] = createSignal<Array<Message>>([]);
    const delMsg = (id: string) => {
        setMsgs((prev) => {
            return [...prev.filter((n) => { return n.id !== id; })];
        });
    };

    Object.defineProperty(window, 'notify', {
        writable: false,
        value: async (title: string, body?: string, type?: Type, timeout = 5) => {
            const id = createUniqueId();
            let palette: Palette | undefined;
            if (type) { palette = type2Palette.get(type); }
            setMsgs((prev) => [...prev, { title, body, type, id, timeout, palette: palette }]);
        }
    });

    return <Portal>
        <div class={props.palette ? `c--notify palette--${props.palette}` : 'c--notify'}>
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
                            <button onClick={() => del()} class="close c--icon">close</button>
                        </div>
                        <Show when={item.body}>
                            <hr />
                            <p class="p-3">{item.body}</p>
                        </Show>
                    </div>;
                }}
            </For>
        </div>
    </Portal>;
}
