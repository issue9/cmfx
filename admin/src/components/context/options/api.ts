// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Mimetype } from '@/core';

/**
 * 与访问后端 API 地址相关的配置项
 */
export interface API {
    /**
     * 后台 API 访问的基地址
     */
    base: string;

    /**
     * 登录地址
     *
     * 该地址应该同时包含以下三个请求方法：POST、PUT 和 DELETE。
     */
    login: string;

    /**
     * 用户基本信息的地址
     *
     * 该地址应该同时包含以下三个请求方法：GET 和 PATCH。
     */
    info: string;

    /**
     * api 请求时可用的分页数值
     */
    pageSizes?: Array<number>;

    /**
     * 默认的分页数量，必须存在于 {@link API#pageSizes}。
     */
    presetSize?: number;

    /**
     * API 接口的内容类型
     */
    encoding?: Encoding;
}

interface Encoding {
    /**
     * 请求内容的格式
     */
    content: Mimetype;

    /**
     * 返回内容的格式
     */
    accept: Mimetype;
}

/**
 * 检测 API 是否都有值
 *
 * @param api 检测对象
 */
export function sanitizeAPI(api: API) {
    if (api.base.length === 0 || (!api.base.startsWith('http://') && !api.base.startsWith('https://'))) {
        throw 'base 格式错误';
    }
    if (api.base.charAt(api.base.length - 1) === '/') { // 保证不以 / 结尾
        api.base = api.base.substring(0, api.base.length - 1);
    }

    api.login = checkAPIPath(api.login, 'login');
    api.info = checkAPIPath(api.info, 'info');

    if (!api.pageSizes || api.pageSizes.length === 0) {
        api.pageSizes = [10, 20, 50, 100, 200];
    }

    if (!api.presetSize) {
        api.presetSize = api.pageSizes[0];
    }
    if (!api.pageSizes.includes(api.presetSize)) {
        throw 'presetSize 必须存在于 pageSizes 之中';
    }

    if (!api.encoding) {
        api.encoding = {
            content: 'application/json',
            accept: 'application/json'
        };
    }
}

function checkAPIPath(path: string, key: string): string {
    if (!path.length) {
        throw `api.${key} 不能为空`;
    }

    if (path.charAt(0) !== '/') {
        path = '/' + path;
    }
    return path;
}
