// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 联合类型转换为交叉类型
 */
type UnionToIntersection<T> = (T extends any ? (k: T) => void : never) extends (k: infer I) => void ? I : never;

/**
 * 翻译文件的内容所需要遵循的格式
 */
export type Dict = { [k: string]: string | Dict; };

type JoinPath<P, B> = P extends string
    ? (B extends string ? `${P}.${B}` : P)
    : B extends string ? B : '';

/**
 * 将翻译对象转换为扁平的格式
 */
type FlattenDict<T extends Dict, P = {}> = UnionToIntersection<
    { [K in keyof T]: T[K] extends Dict ? FlattenDict<T[K], JoinPath<P, K>> : never }[keyof T]
> & { readonly [K in keyof T as JoinPath<P, K>]: T[K] };

/**
 * 获取对象 T 中所有字段类型为 {@link Dict} 的字段名称集合作为类型
 *
 * 比如：
 * ```ts
 * interface Dict {
 *     f1: string;
 *     f2: { f22: string; }
 *     f3: { f33: string; }
 * }
 * type Field = DictField<Dict>;
 * ```
 * Field 的类型将会是 'f2' | 'f3'
 */
type DictField<T> = {
    [K in keyof T]: T[K] extends Dict ? K : never;
}[keyof T];

/**
 * 翻译对象所有字段的联合类型
 */
export type Keys<T extends Dict, F = FlattenDict<T>> = keyof Omit<F, DictField<F>>;

/**
 * 每个翻译对象扁平化的表示
 *
 * 作为 {@link flatten} 的返回值，具体说明也可参考 {@link flatten} 函数。
 */
export type Flatten<T extends Dict> = Record<Keys<T>, string>;

function isDict(value: unknown): value is Dict {
    return value != null && typeof value === 'object';
}

function visitDict<T extends Dict>(flat: Record<string, unknown>, dict: T, path: string): void {
    for (const [key, value] of Object.entries(dict)) {
        const key_path = path ? `${path}.${key}` : key;

        if (isDict(value)) {
            visitDict(flat, value, key_path);
        } else {
            flat[key_path] = value;
        }
    }
}

/**
 * 将翻译对象 dict 转换为一个扁平的对象
 *
 * 该操作，会将所有嵌套的字段转换为以 . 拼接的字符串字段名称，比如：
 * ```ts
 * interface Dict {
 *     f1: '1';
 *     f2: {
 *         f3: '3';
 *     }
 * }
 * ```
 * 将被转换为：
 * ```ts
 * interface Dict {
 *     f1: '1';
 *     'f2.f3': '3';
 * }
 * ```
 */
export function flatten<T extends Dict>(dict: T) {
    const flat: Record<string, string> = {};
    visitDict(flat, dict, '');
    return flat as Flatten<T>;
}

/**
 * 加载翻译对象的方法
 */
export type Loader = { (): Promise<Dict> };