// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { sleep } from '@cmfx/core';
import { JSX, mergeProps, ParentProps } from 'solid-js';
import { Portal, render } from 'solid-js/web';

import { BaseProps, joinClass, MountProps, Palette } from '@/base';
import { useOptions } from '@/context';
import { Message, Props as MessageProps, Type } from './message';
import styles from './style.module.css';

let notifyInst: typeof notify;

/**
 * 发送一条通知给用户
 *
 * @param title - 标题；
 * @param body - 具体内容，如果为空则只显示标题；
 * @param type - 类型，仅对非系统通知的情况下有效；
 * @param lang - 语言，仅对系统通知的情况下有效；
 * @param duration - 如果大于 0，超过此毫秒数时将自动关闭提示框；
 */
export async function notify(
    title: string, body?: string, type?: Type, lang?: string, duration?: number
): Promise<void> {
    return await notifyInst(title, body, type, lang, duration);
}

export type Props = BaseProps & ParentProps & MountProps;

/**
 * 注册全局通知组件
 *
 * 尽可能早地调用该组件，以使 {@link notify} 处于可用状态。
 *
 * NOTE: 不可多次调用，仅用于初始化通知组件。
 */
export function Notify(props: Props): JSX.Element {
    props = mergeProps({palette: 'error' as Palette}, props);
    return <>
        <Portal mount={props.mount}>{initNotify(props)}</Portal>
        {props.children}
    </>;
}

function initNotify(p: Props): JSX.Element {
    const [, opt] = useOptions();
    let ref: HTMLDivElement;

    notifyInst = async (title: string, body?: string, type?: Type, lang?: string, duration?: number) => {
        duration = duration ?? opt.stays;

        if (opt.systemNotify && await systemNotify(title, body, opt.logo, lang ?? opt.locale, duration)) { return; }

        const props: MessageProps = {
            title,
            body,
            type,
            duration,
            closable: true,

            // 通知可能放在 ThemeProvider 之外，所以使用 useOptions 的值。
            transitionDuration: opt.scheme.transitionDuration,
        };
        render(() => <Message {...props} />, ref);
    };

    return <div ref={el => ref = el} class={joinClass(p.palette, styles.notify, p.class)} />;
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
