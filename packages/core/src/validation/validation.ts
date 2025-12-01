// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { FlattenKeys, Flattenable } from '@/types';
import { Params } from '@/api';

/**
 * 验证数据的返回结果
 *
 * @typeParam T - 需要验证的数据类型；
 */
export type ValidResult<T extends Flattenable> = [data: T | undefined, errors: Params<FlattenKeys<T>> | undefined];

/**
 * 验证对象 T 的数据是否合法
 *
 * @typeParam T - 需要验证的数据类型；
 */
export interface Validator<T extends Flattenable> {
    /**
     * 验证整个对象
     *
     * @param obj - 需要验证的对象；
     * @returns 验证结果，如果验证通过则返回 undefined，否则返回一个由元组组成的数组，
     * 元素的第一个元素表示错误字段，第二个元素表示错误信息列表；
     */
    (obj: T): Promise<ValidResult<T>>;
}
