// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

/**
 * 每一步向导的属性
 */
export interface Step {
    /**
     * 向导的内容
     */
    content: JSX.Element;

    /**
     * 标题
     */
    title?: string;

    /**
     * 当前步骤是否已经完成
     */
    completed?: boolean;
}

export interface Ref {
    /**
     * 下一步
     */
    next: () => void;

    /**
     * 上一步
     */
    prev: () => void;
}
