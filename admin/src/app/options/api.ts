// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 与访问后端 API 地址相关的配置项
 */
export interface API {
    [index: string]: string // 限定了所有字段的类型

    /**
     * 后台 API 访问的基地址
     */
    base: string

    /**
     * 登录地址
     */
    login: string

    /**
     * 用户基本信息的地址
     */
    info: string

    /**
     * 用户的基本设置
     */
    settings: string
};

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

    Object.entries(api).forEach(([key, val]) => {
        if (key === 'base') { // base 之前已经检测
            return;
        }

        if (!val.length) {
            throw `api.${key} 不能为空`;
        }

        if (val.charAt(0) !== '/') {
            api[key] = '/' + val;
        }
    });
};
