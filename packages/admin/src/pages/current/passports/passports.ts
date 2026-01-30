// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

/**
 * 每一种登录方式需要提供的组件
 */
export interface PassportComponents {
    /**
     * 登录页面的组件
     */
    Login(): JSX.Element;

    /**
     * 编辑页的操作按钮组件
     *
     * @param refresh - 刷新页面，由 Actions 编辑之后需要由此方法对组件内容进行刷新；
     * @param identity - 与当前组件关联的账号，若是未关联则传递空值；
     */
    Actions(refresh: RefreshFunc, identity?: string): JSX.Element;
}

export interface RefreshFunc {
    (): Promise<void>;
}
