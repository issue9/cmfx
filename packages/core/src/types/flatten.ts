// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 联合类型转换为交叉类型
 */
type UnionToIntersection<T> = (
    T extends any ? (k: T) => void : never
) extends (k: infer I) => void ? I : never;

// 将可选字段转为必须字段，只对当前对象的字段有效果，子字段不会转换。
type Requiredify<T> = {
    [K in keyof T]-?: T[K];
};

type PlainType = string | number | boolean | symbol | bigint | null | undefined;

/**
 * 对象的类型
 *
 * @template T 对象字段的类型；
 */
export type Object<T extends PlainType = PlainType> = { [k: string]: T | Object<T>; };

type JoinPath<P, B> = P extends string
    ? (B extends string ? `${P}.${B}` : P)
    : B extends string ? B : '';

/**
 * 将对象转换为扁平的格式
 *
 * 作为 {@link flatten} 的返回值，具体说明也可参考 {@link flatten} 函数。
 *
 * @template T 需要被转换的对象类型；
 * @template F 如果对象类型单一，可以在此指定，比如翻译对象，其字段可能永远都是字符串；
 */
export type Flatten<T extends Object<F>, F extends PlainType = PlainType> = FlattenT<T, F>;

type FlattenT<T extends Object<F>, F extends PlainType = PlainType, P = {}, TT = Requiredify<T>> =
    UnionToIntersection<
        {
            [K in keyof TT]: TT[K] extends Object<F>
                ? FlattenT<TT[K], F, JoinPath<P, K>> : never
        }[keyof TT]
    >
    & {
        // Exclude 表示去除对象类型 Object<F>，Object<F> 类型已经在上面处理了。
        readonly [K in keyof TT as (TT[K] extends Object<F> ? never : JoinPath<P, K>)]: Exclude<TT[K], Object<F>>;
    };

/**
 * 对象所有字段的联合类型
 *
 * @template T 对象类型；
 * @template FT T 对象的字段类型；
 */
export type Keys<T extends Object<FT>, FT extends PlainType = PlainType> = keyof Flatten<T, FT>;

function isObj<T extends PlainType = PlainType>(value: unknown): value is Object<T> {
    return value != null && typeof value === 'object' && !Array.isArray(value);
}

function visitObj<T extends Object<F>, F extends PlainType = PlainType>(flat: Record<string, F>, obj: T, path: string): void {
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
 * @template T 需要被转换的对象类型；
 * @template F 如果对象类型单一，可以在此指定，比如翻译对象，其字段可能永远都是字符串；
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
 *
 * NOTE: 不支持数组形式的字段。
 */
export function flatten<T extends Object<F>, F extends PlainType = PlainType>(obj: T): Flatten<T, F> {
    const flat: Record<string, F> = {};
    visitObj(flat, obj, '');
    return flat as Flatten<T, F>;
}
