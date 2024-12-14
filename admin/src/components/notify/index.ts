// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

export { Notify, types as notifyTypes } from './notify';
export type { Props as NotifyProps, Type as NotifyType } from './notify';
import { Type } from './notify';

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
