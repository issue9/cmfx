// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Contrast, Theme as CoreTheme, DictLoader, Mimetype, Mode, PickOptional, Scheme, UnitStyle } from '@/core';
import type { LocaleID } from '@/messages';
import { API, checkAPI } from './api';
import type { MenuItem, Routes } from './route';

/**
 * 基本配置
 */
export interface Options {
    /**
     * 页脚的一些链接或是文本内容
     *
     * NOTE: 登录页有此内容，其它页面由用户自行决定是否添加。
     */
    footer?: Array<Link>;

    /**
     * 网站的标题
     */
    title: string;

    /**
     * 默认的主题
     */
    theme?: Theme;

    /**
     * LOGO，URL 格式
     */
    logo: string;

    /**
     * 提供部分一系统或浏览器相关的设置
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
     * 左侧的导航菜单
     */
    menus: Array<MenuItem>;

    /**
     * 用户菜单
     */
    userMenus: Array<MenuItem>;

    /**
     * API 接口请求时的内容类型
     */
    mimetype?: Mimetype;

    /**
     * 与本地化相关的一些设置
     */
    locales: Locales;
}

interface System {
    /**
     * 采用系统通知代替框架内部的实现
     *
     * 该功能需要在 https 下才有效，否则依然会采用内部的通知界面。
     */
    notification?: boolean;

    /**
     * 将浏览器的对话框代替为框架内的实现，目前支持以下几种：
     *  -window.alert
     *  -window.prompt
     *  -window.confirm
     */
    dialog?: boolean;
}

export interface Locales {
    /**
     * 指定本地化文本的加载方式
     *
     * 并不会自动加载内置的本地化对象，也需要在此指定。
     */
    messages: Record<string, Array<DictLoader>>;

    /**
     * 支持的语言
     */
    locales: Array<LocaleID>;

    /**
     * 备用的本地化 ID
     *
     * 在所需的本地化 ID 无法找到时，会采用该值。
     */
    fallback: LocaleID;

    /**
     * 一些与本地化相关的单位名称的显示方式，说明可参考 {@link UnitStyle}
     */
    unitStyle?: UnitStyle;
}

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
     * 第一个元素的将被当作默认的主题使用。可由 {@link CoreTheme#genScheme} 和 {@link CoreTheme#genSchemes} 生成主题数据。
     *
     * 如果为空，则采用 genSchemes(20) 生成主题数据。
     */
    schemes: Array<Scheme>;
}

const presetOptions: Readonly<PickOptional<Options>> = {
    system: {},
    titleSeparator: ' | ',
    theme: { mode: 'system', contrast: 'nopreference', schemes: CoreTheme.genSchemes(20) },
    mimetype: 'application/json',
} as const;

/**
 * 根据 o 生成一个完整的 Options 对象，且会检测字段是否正确。
 *
 * @param o 原始的对象
 */
export function build(o: Options): Required<Options> {
    if (o.title.length === 0) {
        throw 'title 不能为空';
    }

    if (o.logo.length === 0) {
        throw 'logo 不能为空';
    }

    const opt = Object.assign({}, presetOptions, o) as Required<Options>;

    if (!opt.titleSeparator) {
        throw 'titleSeparator 不能为空';
    }

    if (opt.locales.locales.length === 0) {
        throw 'locales.locales 不能为空';
    }

    if (!opt.locales.unitStyle) {
        opt.locales.unitStyle = 'short';
    }

    checkAPI(opt.api);

    return opt;
}

interface Link {
    title: string;
    link?: string;
}
