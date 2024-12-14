// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 与访问后端 API 地址相关的配置项
 */
export interface API {
    /**
     * 后台 API 访问的基地址
     */
    base: string

    /**
     * 登录地址
     *
     * 该地址应该同时包含以下三个请求方法：POST、PUT 和 DELETE。
     */
    login: string

    /**
     * 用户基本信息的地址
     *
     * 该地址应该同时包含以下三个请求方法：GET 和 PATCH。
     */
    info: string

    /**
     * api 请求时可用的分页数值
     */
    pageSizes: Array<number>

    /**
     * 默认的分页数量，必须存在于 {@link API#pageSizes}。
     */
    defaultSize: number;
}

/**
 * 检测 API 是否都有值
 *
 * @param api 检测对象
 */
export function checkAPI(api: API) {
    if (api.base.length === 0 || (!api.base.startsWith('http://') && !api.base.startsWith('https://'))) {
        throw 'base 格式错误';
    }
    if (api.base.charAt(api.base.length - 1) === '/') { // 保证不以 / 结尾
        api.base = api.base.substring(0, api.base.length - 1);
    }

    api.login = checkAPIPath(api.login, 'login');
    api.info = checkAPIPath(api.info, 'info');

    if (api.pageSizes.length === 0) {
        throw 'pageSizes 不能为空';
    }

    if (!api.pageSizes.includes(api.defaultSize)) {
        throw 'defaultSize 必须存在于 pageSizes 之中';
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
