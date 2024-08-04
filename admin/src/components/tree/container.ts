// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { BaseProps } from '@/components/base';
import { Item, Value } from './item';

/**
 * {@link Item} 容器的基本属性
 */
export interface Props extends BaseProps {
    /**
     * 子项
     */
    children: Array<Item>;

    /**
     * 当选择项发生变化时触发的事件
     */
    onChange?: { (selected: Value, old?: Value): void };

    /**
     * 选中项的 CSS 类
     *
     * 默认值为 selected，如果不需要，则可以设置为 ''。
     */
    selectedClass?: string;
}
