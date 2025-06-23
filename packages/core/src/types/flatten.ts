// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 联合类型转换为交叉类型
 */
type UnionToIntersection<T> = (T extends any ? (k: T) => void : never) extends (k: infer I) => void ? I : never;

/**
 * 对象的类型
 *
 * @template T 对象字段的类型；
 */
export type Obj<T extends unknown = unknown> = { [k: string]: T | Obj<T>; };

type JoinPath<P, B> = P extends string
    ? (B extends string ? `${P}.${B}` : P)
    : B extends string ? B : '';

/**
 * 将对象转换为扁平的格式
 */
type FlattenObj<T extends Obj<F>, F extends unknown = unknown, P = {}> = UnionToIntersection<
    { [K in keyof T]: T[K] extends Obj<F> ? FlattenObj<T[K], F, JoinPath<P, K>> : never }[keyof T]
> & { readonly [K in keyof T as JoinPath<P, K>]: T[K] };

/**
 * 获取对象 T 中所有字段类型为 {@link Obj} 的字段名称集合作为类型
 *
 * 比如：
 * ```ts
 * interface Dict {
 *     f1: string;
 *     f2: { f22: string; }
 *     f3: { f33: string; }
 * }
 * type Field = Field<Dict>;
 * ```
 * Field 的类型将会是 'f2' | 'f3'
 */
type Field<T, F extends unknown = unknown> = {
    [K in keyof T]: T[K] extends Obj<F> ? K : never;
}[keyof T];

/**
 * 对象所有字段的联合类型
 *
 * @template T 对象类型；
 * @template FT T 对象的字段类型；
 */
export type Keys<T extends Obj<FT>, FT extends unknown = unknown, F = FlattenObj<T, FT>> = keyof Omit<F, Field<F, FT>>;

/**
 * 每个对象扁平化的表示
 *
 * 作为 {@link flatten} 的返回值，具体说明也可参考 {@link flatten} 函数。
 */
export type Flatten<T extends Obj<F>, F extends unknown = unknown> = Record<Keys<T, F>, F>;

function isObj<T extends unknown = unknown>(value: unknown): value is Obj<T> {
    return value != null && typeof value === 'object';
}

function visitObj<T extends Obj<F>, F extends unknown = unknown>(flat: Record<string, unknown>, obj: T, path: string): void {
    for (const [key, value] of Object.entries(obj)) {
        const key_path = path ? `${path}.${key}` : key;

        if (isObj<F>(value)) {
            visitObj(flat, value, key_path);
        } else {
            flat[key_path] = value;
        }
    }
}

/**
 * 将对象 dict 转换为一个扁平的对象
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
export function flatten<T extends Obj<F>, F extends unknown = unknown>(dict: T): Flatten<T, F> {
    const flat: Record<string, F> = {};
    visitObj(flat, dict, '');
    return flat as Flatten<T, F>;
}
