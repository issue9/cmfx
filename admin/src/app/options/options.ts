// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { BaseDict } from '@solid-primitives/i18n';

import { Contrast, Mimetype, Mode, Scheme } from '@/core';
import type { Locale, LocaleMessages } from '@/locales';
import { API, checkAPI } from './api';
import type { MenuItem, Routes } from './route';

/**
 * 基本配置
 */
export interface Options {
    /**
     * 网站的标题
     */
    title: string

    /**
     * 默认的主题
     */
    theme?: Theme

    /**
     * LOGO，URL 格式
     */
    logo: string

    /**
     * 提供部分一系统或浏览器相关的设置
     */
    system?: System;

    /**
     * 后台需要用到的 API 地址
     */
    api: API

    /**
     * 标题中的分隔符
     */
    titleSeparator?: string

    /**
     * 路由设置
     */
    routes: Routes

    /**
     * 左侧的导航菜单
     */
    menus: Array<MenuItem>

    mimetype?: Mimetype

    /**
     * 与本地化相关的一些设置
     */
    locales: Locales
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
     * 本地化 ID 及对应内容的加载函数
     */
    messages: LocaleMessages<BaseDict>;

    /**
     * 支持的语言
     *
     * 需要确保这些指定的语言可以通过 {@link Locales#loader} 正常加载内容。
     */
    locales: Array<Locale>

    /**
     * 在找不到语言时的默认项
     */
    fallback: Locale
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
     * 主题的颜色
     *
     * 如果是数值类型，那么将以此值作为主色调的色相，然后根据此值生成 {@link Scheme} 对象。
     */
    scheme: Scheme | number;
}

const presetOptions = {
    system: {},
    titleSeparator: ' | ',
    theme: { mode: 'system', contrast: 'nopreference', scheme: 20 },
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

    const opt: Required<Options> = Object.assign({}, presetOptions, o);

    if (!opt.titleSeparator) {
        throw 'titleSeparator 不能为空';
    }

    if (opt.locales.locales.length === 0) {
        throw 'locales.locales 不能为空';
    }

    checkAPI(opt.api);

    return opt;
}
