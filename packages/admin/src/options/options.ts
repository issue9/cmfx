// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Contrast, Theme as CoreTheme, DictLoader, Mode, Scheme, UnitStyle } from '@cmfx/core';

import { API, sanitizeAPI } from './api';
import type { Aside } from './aside';
import { presetAside } from './aside';
import type { MenuItem, Routes } from './route';
import { PickOptional } from './types';

/**
 * 项目的基本配置
 */
export interface Options {
    /**
     * 该 app 的 ID
     *
     * 用于保证同框架的不同应用在浏览器中保存的数据具有唯一性。
     */
    id: string;

    /**
     * 配置内容在 storage 中的名称
     */
    configName?: string | number;

    /**
     * 网站的标题
     */
    title: string;

    /**
     * 保存本地数据的位置
     */
    storage?: Storage;

    /**
     * 默认的主题
     */
    theme?: Theme;

    /**
     * LOGO，URL 格式
     */
    logo: string;

    /**
     * 提供部分系统或浏览器相关的设置
     */
    system?: System;

    /**
     * 后台需要用到的 API 地址
     */
    api: API;

    /**
     * 标题中的分隔符
     */
    titleSeparator?: string;

    /**
     * 路由设置
     */
    routes: Routes;

    /**
     * 侧边栏的设置
     */
    aside?: Aside;

    /**
     * 用户菜单
     */
    userMenus: Array<MenuItem>;

    /**
     * 与本地化相关的一些设置
     */
    locales: Locales;

    notifyTimeout?: number;
}

/**
 * 一些与系统相关的设置
 */
interface System {
    /**
     * 采用系统通知代替框架内部的实现
     *
     * 该功能需要在 https 下才有效，否则依然会采用内部的通知界面。
     */
    notification?: boolean;

    /**
     * 将浏览器的对话框代替为框架内的实现，目前支持以下几种：
     *  - window.alert
     *  - window.prompt
     *  - window.confirm
     */
    dialog?: boolean;
}

/**
 * 设置项中与本地化相关的设置
 */
export interface Locales {
    /**
     * 指定本地化文本的加载方式
     *
     * 并不会自动加载内置的本地化对象，也需要在此指定。
     */
    messages: Record<string, Array<DictLoader>>;

    /**
     * 备用的本地化 ID
     *
     * 在所需的本地化 ID 无法找到时，会采用该值。
     */
    fallback: string;

    /**
     * 一些与本地化相关的单位名称的显示方式，说明可参考 {@link UnitStyle}
     */
    unitStyle?: UnitStyle;
}

/**
 * 主题相关的设置
 */
export interface Theme {
    /**
     * 主题模式
     */
    mode: Mode;

    /**
     * 对比度
     */
    contrast: Contrast;

    /**
     * 可用的主题列表
     *
     * 可由 {@link CoreTheme#genScheme} 和 {@link CoreTheme#genSchemes} 生成主题数据。
     *
     * 如果为空，则采用 genSchemes(20) 生成主题数据。
     */
    schemes: Array<Scheme>;
    
    // NOTE: scheme 不采用在 schemes 中的索引，而是对应的实例值，
    // 这样的做的好处是在改变 schemes 的值时，scheme 依然是有意义的。
    // 且在 @cmfx/components 的配置中也是采用 Scheme 对象的值保存的。

    /**
     * 当前使用的主题，必须存在于 schemes 中。
     */
    scheme: Scheme;
}

const presetSchemes = CoreTheme.genSchemes(20);

const presetOptions: Readonly<PickOptional<Options>> = {
    storage: window.localStorage,
    configName: 0,
    system: {
        dialog: true,
        notification: true,
    },
    titleSeparator: ' | ',
    theme: {
        mode: 'system',
        contrast: 'nopreference',
        schemes: presetSchemes,
        scheme: presetSchemes[0]
    },
    notifyTimeout: 5000,
} as const;


type ReqOptions = Required<Omit<Options, 'api'>> & { api: Required<API> };

/**
 * 根据 o 生成一个完整的 {@link Options} 对象，且会检测字段是否正确。
 *
 * @param o 原始的对象
 */
export function build(o: Options): ReqOptions {
    if (o.id.length === 0) {
        throw 'id 不能为空';
    }

    if (o.title.length === 0) {
        throw 'title 不能为空';
    }

    if (o.logo.length === 0) {
        throw 'logo 不能为空';
    }

    const opt = Object.assign({}, presetOptions, o) as Required<Options>;
    opt.aside = Object.assign({}, presetAside, opt.aside);

    if (!opt.titleSeparator) {
        throw 'titleSeparator 不能为空';
    }

    if (!opt.locales.unitStyle) {
        opt.locales.unitStyle = 'short';
    }

    opt.api = sanitizeAPI(opt.api);

    return opt as ReqOptions;
}
