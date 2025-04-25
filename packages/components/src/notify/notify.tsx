// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { sleep } from '@cmfx/core';
import { createSignal, createUniqueId, For, JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { Palette } from '@/base';
import { Alert, Props as AlertProps } from './alert';

export const types = ['error', 'warning', 'success', 'info'] as const;

export type Type = typeof types[number];

export const type2Palette: ReadonlyMap<Type, Palette> = new Map<Type, Palette>([
    ['error', 'error'],
    ['warning', 'tertiary'],
    ['success', 'primary'],
    ['info', 'secondary'],
]);

let notifyInst: { (title: string, body?: string, type?: Type, lang?: string, timeout?: number): Promise<void>; };

/**
 * 发送一条通知给用户
 *
 * @param title 标题；
 * @param body 具体内容，如果为空则只显示标题；
 * @param type 类型，仅对非系统通知的情况下有效；
 * @param lang 语言，采用系统通知的时候会用到此值；
 * @param timeout 如果大于 0，超过此毫秒数时将自动关闭提法；
 */
export async function notify(title: string, body?: string, type?: Type, lang?: string, timeout?: number): Promise<void> {
    // 需要调用 initNotify 方法初始化之后才有效
    return await notifyInst(title, body, type, lang, timeout);
}

/**
 * 注册全局通知组件
 *
 * 尽可能早地调用该组件，以使当前方法处于可用状态。
 *
 * NOTE: 这也是一个组件，如果想以函数的形式调用，
 * 需要在 SolidJS 初始化之后调用，比如在 HashRouter 的 Root 组件中。
 *
 * @param system 是否将通知发送到操作系统的通知栏上；
 * @param icon 如果 system 为 true，该参数指定弹出框上的图标；
 */
export function initNotify(system?: boolean, icon?: string): JSX.Element {
    const [msgs, setMsgs] = createSignal<Array<Omit<AlertProps, 'del'>>>([]);

    notifyInst = async (title: string, body?: string, type?: Type, lang?: string, timeout = 5000) => {
        if (system && await systemNotify(title, body, icon, lang, timeout)) {
            return;
        }
 
        const id = createUniqueId();
        let palette: Palette | undefined;
        if (type) { palette = type2Palette.get(type); }
        setMsgs((prev) => [...prev, { title, body, type, id, timeout, palette: palette }]);
    };

    return <Portal>
        <div class='c--notify'>
            <For each={msgs()}>
                {item =>(
                    <Alert {...item} del={(id)=>{
                        setMsgs((prev) => {
                            return [...prev.filter((n) => { return n.id !== id; })];
                        });
                    }} />
                )}
            </For>
        </div>
    </Portal>;
}

/**
 * 向系统发送通知
 *
 * @returns 如果发送成功返回 true，否则返回 false。
 */
async function systemNotify(title: string, body?: string, icon?: string, lang?: string, timeout?: number): Promise<boolean> {
    if (!('Notification' in window)) { // 不支持
        return false;
    } else if (Notification.permission == 'denied') { // 明确拒绝
        return false;
    } else if (Notification.permission !== 'granted') { // 未明确的权限
        if (await Notification.requestPermission()=='denied') {
            return false;
        }
    }

    const n = new Notification(title, {
        icon: icon,
        lang: lang,
        body: body,
    });

    if (timeout && timeout > 0) {
        await sleep(timeout);
        n.close();
    }

    return true;
}
