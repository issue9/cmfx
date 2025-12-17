// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Params } from '@/api';
import { Locale } from '@/locale';
import { FlattenKeys, Flattenable } from '@/types';

/**
 * 验证数据的返回结果
 *
 * @typeParam T - 需要验证的数据类型；
 */
export type ValidResult<T extends Flattenable> = [data: T | undefined, errors: Params<FlattenKeys<T>> | undefined];

/**
 * 验证器
 *
 * @typeParam T - 需要验证的数据类型；
 */
export interface Validator<T extends Flattenable> {
    /**
     * 改变当前语言
     *
     * @remarks
     * 该操作会改变之后对数据验证时的错误信息
     */
    changeLocale(locale: Locale): void;

    /**
     * 验证数据
     *
     * @param obj - 需要验证的数据；
     * @param path - 如果不为空表示采用规则 path 验证 obj；
     */
    valid(obj: any, path?: FlattenKeys<T>): Promise<ValidResult<T>>;
}
