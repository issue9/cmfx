// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Params } from '@/api';
import { FlattenKeys, Flattenable } from '@/types';

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
     */
    (obj: T): Promise<ValidResult<T>>;
}
