// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { SetParams, useSearchParams } from '@solidjs/router';


/**
 * 根据 T 生成其值类型为字符串的对象
 *
 * 该类型符合 {@link useSearchParams} 的类型参数。
 */
export type Params<T extends SetParams> = Record<keyof T, string>;

/**
 * 从地址的查询参数中获取值
 *
 * NOTE: 该方法可用于初始化 {@link Props#queries} 字段。
 *
 * @template Q 查询参数的类型；
 * @param preset 默认值，必须包含所有字段，哪怕是零值，否则与 searchParamsGetter 中的字段存在类型冲突时，无法处理；
 * @param searchParamsGetter {@link useSearchParams} 返回值的第一个元素
 * @returns 结合 preset 和从地址中获取的参数合并的参数对象
 */
export function fromSearch<Q extends SetParams>(preset: Q, searchParamsGetter: ReturnType<typeof useSearchParams<Params<Q>>>[0]): Q {
    // 需要将 useSearchParams 返回的参数转换为 Q 类型，
    // 即将 {[x:string]:string} 转换为 {[x:string]:string|number|boolean|null|undefined}

    for (const key in searchParamsGetter) {
        if (searchParamsGetter[key] && preset[key] !== searchParamsGetter[key]) {
            const v2 = searchParamsGetter[key];
            switch (typeof preset[key]) {
            case 'string':
                preset[key] = v2 as any;
                break;
            case 'number':
                preset[key] = parseInt(v2) as any;
                break;
            case 'boolean':
                preset[key] = (v2 !== 'false') as any;
                break;
            default:
                preset[key] = v2 as any;
            }
        }
    }

    return preset;
}

/**
 * 将查询参数写入地址中
 *
 * NOTE: 可以 {@link Props#load} 调用，一般与 {@link fromSearch} 成对出现。
 *
 * @template Q 查询参数的类型；
 * @param q 查询参数
 * @param searchSetter {@link useSearchParams} 返回值的第二个元素
 */
export function saveSearch<Q extends SetParams>(q: Q, searchSetter: ReturnType<typeof useSearchParams<Params<Q>>>[1]): void {
    searchSetter(q);
}
