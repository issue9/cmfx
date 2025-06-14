// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { BaseProps } from '@/base';
import { Item } from './item';

/**
 * {@link Item} 容器的基本属性
 */
export interface Props extends BaseProps {
    /**
     * 子项
     */
    children: Array<Item>;

    /**
     * 选中项的 CSS 类，如果不需要，则可以设置为 ''。
     */
    selectedClass?: string;
}
