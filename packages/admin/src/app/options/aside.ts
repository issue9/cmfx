// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { DrawerProps } from '@cmfx/components';
import { PickOptional } from '@cmfx/core';

import type { MenuItem } from './route';

/**
 * 侧边栏的配置对象
 */
export interface Aside {
    /**
     * 左侧的导航菜单
     */
    menus: Array<MenuItem>;

    /**
     * 侧边栏在小于此值时将变为浮动状态
     */
    floatingMinWidth?: Exclude<DrawerProps['floating'], boolean>;
}

export const presetAside: Readonly<PickOptional<Aside>> = {
    floatingMinWidth: 'lg',
} as const;
