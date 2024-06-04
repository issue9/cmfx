// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 管理后台的基本配置
 */
export interface Options {
    /**
     * 后台 API 访问的基地址
     */
    baseURL: string

    /**
     * 后台需要用到的 API 地址，基于 baseURL。
     */
    apis: APIs

    /**
     * 标题中的分隔符
     */
    titleSeparator?: string

    /**
     * 左侧的导航菜单
     */
    menus: Array<MenuItem>

    /**
     * 底部的导航链接
     */
    footer: Array<MenuItem>
}

export interface MenuItem {
    /**
     * 图标名称
     */
    icon?: string

    /**
     * 菜单的标题
     */
    title: string

    /**
     * 路由的路转路径，如果是分组项，此值为空。
     */
    path?: string

    /**
     * 子菜单
     */
    items: Array<MenuItem>
}

export interface APIs {
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
}

const presetOptions = {
    titleSeparator: ' | '
};

export function buildOptions(o: Options): Required<Options> {
    return Object.assign({}, presetOptions, o);
};
