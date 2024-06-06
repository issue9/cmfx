// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 由 APIs.env 接口返回的数据
 */
export interface Env {
    name: string;
    shortName: string;
};

export interface APIs {
    [index: string]: string // 限定了所有字段的类型

    /**
     * 获取基本环境的 API 地址，始终以 GET 请求方式访问。
     */
    env: string

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
 * 检测 APIs 是否都有值
 * @param apis 检测对象
 */
export function checkAPIs(apis: APIs) {
    Object.entries(apis).forEach(([key,val])=>{
        if (val.length === 0){
            throw `apis.${key} 格式错误`;
        }

        if (val.charAt(0) !== '/') {
            val = '/'+val;
            apis[key] = val;
        }
    });
};
