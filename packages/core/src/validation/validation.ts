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
 * 验证器
 *
 * @typeParam T - 需要验证的数据类型；
 */
export interface Validator<T extends Flattenable> {
    /**
     * 验证数据
     *
     * @param obj - 需要验证的数据；
     * @param path - 如果不为空表示采用规则 path 验证 obj；
     */
    (obj: T): Promise<ValidResult<T>>;
    (obj: any, path?: FlattenKeys<T>): Promise<ValidResult<T>>;
}
