// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Mimetype, PickOptional } from '@cmfx/core';

/**
 * 与访问后端 API 相关的配置项
 */
export interface API {
    /**
     * 后台 API 访问的基地址
     */
    base: string;

    /**
     * 相对于 base 的令牌管理地址
     *
     * 该地址应该同时包含以下两个请求方法：
     *  - PUT 刷新令牌；
     *  - DELETE 删除令牌；
     */
    token: string;

    /**
     * 相对于 base 的获取用户基本信息的地址
     *
     * 该地址应该同时包含以下两个请求方法：
     *  - PATCH 更新用户信息；
     *  - GET 获取用户基本信息
     */
    info: string;

    /**
     * api 请求时可用的分页数值
     *
     * @defaultValue [10, 20, 50, 100, 200]
     */
    pageSizes?: Array<number>;

    /**
     * 默认的分页数量，必须存在于 {@link API#pageSizes}。
     *
     * @defaultValue 20
     */
    pageSize?: number;

    /**
     * 请求内容的格式
     *
     * @defaultValue 'application/json'
     */
    contentType?: Mimetype;

    /**
     * 返回内容的格式
     *
     * @defaultValue 'application/json'
     */
    acceptType?: Mimetype;
}

const presetAPI: Readonly<PickOptional<API>> = {
    pageSizes: [10, 20, 50, 100, 200],
    pageSize: 20,
    contentType: 'application/json',
    acceptType: 'application/json'
};

/**
 * 检测 API 是否都有值
 *
 * @param api - 检测对象
 */
export function sanitizeAPI(api: API): Required<API> {
    const a = Object.assign(presetAPI, api);

    if (a.base.length === 0 || (!api.base.startsWith('http://') && !api.base.startsWith('https://'))) {
        throw new Error('base 格式错误');
    }
    if (a.base.charAt(a.base.length - 1) === '/') { // 保证不以 / 结尾
        a.base = a.base.substring(0, a.base.length - 1);
    }

    a.token = checkAPIPath(a.token, 'token');
    a.info = checkAPIPath(a.info, 'info');

    if (!a.pageSizes!.includes(a.pageSize!)) {
        throw new Error('pageSize 必须存在于 pageSizes 之中');
    }


    return a as Required<API>;
}

function checkAPIPath(path: string, key: string): string {
    if (!path.length) {
        throw new Error(`api.${key} 不能为空`);
    }

    if (path.charAt(0) !== '/') { path = '/' + path; }

    return path;
}
