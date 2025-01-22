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
     * @param id 当前组件的 ID
     */
    Actions(id: string): JSX.Element;
}