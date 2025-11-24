// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Signal, JSX } from 'solid-js';

/**
 * 表示颜色选择面板的类型
 */
export interface Picker {
    /**
     * 表示当前拾取框的唯一 ID
     */
    id: string;

    /**
     * 表示当前拾取框的翻译 ID
     */
    localeID: string;

    /**
     * 判定给定的值是否属于当前的实例
     *
     * @remarks
     * 可能存在多个实现都返回 true 的情况。
     */
    include(value: string): boolean;

    /**
     * 实现实例的面板
     */
    panel(s: Signal<string>): JSX.Element;
}
