// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { APIs, checkAPIs } from './apis.ts';

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
     * 数据类型
     * 
     * 比如 application/json、application/xml 等。
     */
    mimetype?: string

    /**
     * 左侧的导航菜单
     */
    menus: Array<MenuItem>

    /**
     * 底部的导航链接
     */
    footer?: Array<MenuItem>
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
    key?: string

    /**
     * 子菜单
     */
    items?: Array<MenuItem>
}

const presetOptions = {
    titleSeparator: ' | ',
    mimetype: 'application/json',
    footer: Array<MenuItem>()
};

/**
 * 根据 o 生成一个完整的 Options 对象，且会检测字段是否正确。
 * @param o 原始的对象
 */
export function buildOptions(o: Options): Required<Options> {
    const opt: Required<Options> = Object.assign({}, presetOptions, o);

    if (opt.baseURL.length === 0 || (!opt.baseURL.startsWith('http://') && !opt.baseURL.startsWith('https://'))) {
        throw 'baseURL 格式错误';
    }
    if (opt.baseURL.charAt(opt.baseURL.length-1)==='/') { // 保证以 / 结尾
        opt.baseURL = opt.baseURL.substring(0,opt.baseURL.length-1);
    }

    if (!opt.titleSeparator) {
        throw 'titleSeparator 不能为空';
    }

    checkAPIs(opt.apis);
    checkMenus([],opt.menus);

    if (!opt.footer) {
        checkMenus([], opt.footer);
    }

    return opt;
};

/**
 * 检测 items 是否存在相同的的 path
 * @param keys 缓存的所有 MenuItems.Key 值
 * @param items 需要检测的对象
 */
export function checkMenus(keys: Array<string>,items: Array<MenuItem>) {
    for(const item of items){
        if (item.title.length === 0) {
            throw 'title 不能为空';
        }
        
        if (keys.find((v)=>{return v==item.key;})) {
            throw `存在同名的 key: ${item.key}`;
        }
        
        if(item.key) {
            keys.push(item.key);
        }
        
        if (item.items && item.items.length > 0) {
            checkMenus(keys,item.items);
        }
    }
};
