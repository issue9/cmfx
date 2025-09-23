// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { sleep } from '@cmfx/core';
import { createSignal, createUniqueId, For, JSX, mergeProps, ParentProps } from 'solid-js';
import { Portal } from 'solid-js/web';

import { BaseProps, joinClass, Palette } from '@/base';
import { Alert, Props as AlertProps } from './alert';
import styles from './style.module.css';

export const types = ['error', 'warning', 'success', 'info'] as const;

export type Type = typeof types[number];

export const type2Palette: ReadonlyMap<Type, Palette> = new Map<Type, Palette>([
    ['error', 'error'],
    ['warning', 'tertiary'],
    ['success', 'primary'],
    ['info', 'secondary'],
]);

let notifyInst: typeof notify;

/**
 * 发送一条通知给用户
 *
 * NOTE: 仅可在 {@link Notify} 组件之内使用。
 *
 * @param title - 标题；
 * @param body - 具体内容，如果为空则只显示标题；
 * @param type - 类型，仅对非系统通知的情况下有效；
 * @param lang - 语言，仅对系统通知的情况下有效；
 * @param timeout - 如果大于 0，超过此毫秒数时将自动关闭提示框；
 */
export async function notify(
    title: string, body?: string, type?: Type, lang?: string, timeout?: number
): Promise<void> {
    return await notifyInst(title, body, type, lang, timeout);
}

export interface Props extends BaseProps, ParentProps {
    /**
     * 是否将通知发送到操作系统的通知栏上
     */
    system?: boolean;

    /**
     * 指定弹出框上的图标，仅在 system 为 true 时有效。
     */
    icon?: string;

    /**
     * 语言，仅在 system 为 true 时有效，该值在 {@link notify} 参数中可修改。
     */
    lang?: string;

    /**
     * 通知的自动关闭时间，如果大于 0，超过此毫秒数时将自动关闭提示框，该值在 {@link notify} 参数中可修改。
     */
    timeout: number;
}

const presetProps:Props = {
    timeout: 5000,
    palette: 'error',
} as const;

/**
 * 注册全局通知组件
 *
 * 尽可能早地调用该组件，以使 {@link notify} 处于可用状态。
 *
 * NOTE: 不可多次调用，仅用于初始化通知组件。
 */
export default function Notify(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);
    return <>
        <Portal>{initNotify(props)}</Portal>
        {props.children}
    </>;
}

function initNotify(p: Props): JSX.Element {
    const [msgs, setMsgs] = createSignal<Array<Omit<AlertProps, 'del'>>>([]);

    notifyInst = async (title: string, body?: string, type?: Type, lang?: string, timeout?: number) => {
        lang = lang ?? p.lang;
        timeout = timeout ?? p.timeout;

        if (p.system && await systemNotify(title, body, p.icon, lang, timeout)) {
            return;
        }

        const id = createUniqueId();
        let palette: Palette | undefined;
        if (type) { palette = type2Palette.get(type); }
        setMsgs((prev) => [...prev, { title, body, type, id, timeout, palette: palette }]);
    };

    return <div class={joinClass(p.palette, styles.notify, p.class)}>
        <For each={msgs()}>
            {item => (
                <Alert {...item} del={(id) => {
                    setMsgs((prev) => {
                        return [...prev.filter((n) => { return n.id !== id; })];
                    });
                }} />
            )}
        </For>
    </div>;
}

/**
 * 向系统发送通知
 *
 * @returns 如果发送成功返回 true，否则返回 false。
 */
async function systemNotify(
    title: string, body?: string, icon?: string, lang?: string, timeout?: number
): Promise<boolean> {
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
