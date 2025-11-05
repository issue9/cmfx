// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * 接口错误返回的对象
 *
 * @typeParam E - 表示 extension 字段的类型，如果该字段空值，不需要指定。
 */
export interface Problem<E = never> {
    type: string;
    title: string;
    status: number;
    detail?: string;
    instance?: string;
    extension?: E;

    /**
     * 具体的错误字段
     *
     * 根据 status 的不同，可能表示提交对象、查询参数或是报头的错误。
     */
    params?: Array<Param>;
}

export interface Param {
    name: string;
    reason: string;
}

/**
 * 接口返回的对象
 *
 * @typeParam R - 表示在接口操作成功的情况下返回的类型，如果为空表示 never；
 * @typeParam PE - 表示在接口操作失败之后，{@link Problem#extension} 字段的类型，如果该字段为空值，表示为 never。
 */
export type Return<R = never, PE = never> = {
    /**
     * 返回的报头
     */
    headers?: Headers;

    /**
     * 服务端返回的类型
     */
    body?: Problem<PE>;

    /**
     * 状态码
     */
    status: number;

    /**
     * 是否出错了。
     */
    ok: false;
} | {
    /**
     * 返回的报头
     */
    headers?: Headers;

    /**
     * 服务端返回的类型
     */
    body?: R;

    /**
     * 状态码
     */
    status: number;

    /**
     * 是否出错了。
     */
    ok: true;
};

/**
 * 分页接口返回的对象
 *
 * @typeParam T - 表示当前页的类型
 */
export interface Page<T> {
    count: number;
    current: Array<T>;
    more?: boolean;
}

/**
 * 查询参数的单个字段的类型
 */
type QueryValue = string | number | boolean | null | undefined;

/**
 * 查询参数的类型
 */
export interface Query {
    [k: string]: QueryValue | Array<QueryValue>;
    page?: number;
    size?: number;
}
