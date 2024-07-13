// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { sleep } from '@/core/time';

/**
 * 向系统发送通知
 *
 * @returns 如果发送成功返回 true，否则返回 false。
 */
export async function notify(title: string, body: string, icon?: string, lang?: string, timeout?: number): Promise<boolean> {
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
        await sleep(timeout * 1000);
        n.close();
    }

    return true;
}
