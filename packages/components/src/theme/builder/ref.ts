// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT


import { Scheme } from '@/base';

export interface Ref {
    /**
     * 导出 Scheme 对象
     */
    export(): Scheme;

    /**
     * 重置对象
     */
    reset(): void;

    /**
     * 将当前主题应用到全局
     */
    apply(): void;
}
