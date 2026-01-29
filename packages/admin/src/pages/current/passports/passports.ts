// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

/**
 * 登录方式需要实现的接口
 */
export interface PassportComponents {
    /**
     * 登录页面的组件
     */
    Login(): JSX.Element;

    /**
     * 编辑页的操作按钮组件
     *
     * @param refresh - 刷新页面，Actions 当前方法会改变验证方法列表的内容，可以调用此方法刷新；
     * @param identity - 与当前组件关联的账号，若是未关联则传递空值；
     */
    Actions(refresh: RefreshFunc, identity?: string): JSX.Element;
}

export interface RefreshFunc {
    (): Promise<void>;
}
