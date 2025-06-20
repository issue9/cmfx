// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Breakpoint } from '@cmfx/components';

import type { MenuItem } from './route';
import { PickOptional } from './types';

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
    floatingMinWidth?: Breakpoint;
}

export const presetAside: Readonly<PickOptional<Aside>> = {
    floatingMinWidth: 'xs',
} as const;