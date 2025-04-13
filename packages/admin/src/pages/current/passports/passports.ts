// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

export interface PassportComponents {
    /**
     * 登录页面
     */
    Login(): JSX.Element;

    /**
     * 编辑页的操作按钮
     *
     * @param refresh 刷新页面，Actions 当前方法会改变验证方法列表的内容，可以调用此方法刷新；
     * @param identity 与当前组件关联的账号，若是未关联则传递空值；
     */
    Actions(refresh: RefreshFunc, identity?: string): JSX.Element;
}

export interface RefreshFunc {
    (): Promise<void>;
}
