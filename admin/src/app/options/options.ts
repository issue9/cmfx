// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { BaseDict } from '@solid-primitives/i18n';

import { Contrast, Mimetype, Mode, Scheme } from '@/core';
import type { Locale } from '@/locales';
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
    theme: Theme

    /**
     * LOGO，URL 格式
     */
    logo: string

    /**
     * 是否优先使用系统通知
     */
    systemNotify?: boolean

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

    /**
     * 底部的导航链接
     */
    footer?: Array<MenuItem>

    mimetype?: Mimetype

    /**
     * 与本地化相关的一些设置
     */
    locales: Locales
}

export interface Locales {
    /**
     * 加载本地化内容的函数
     */
    loader: { (locale: Locale): Promise<BaseDict> }

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
    mode: Mode;
    contrast: Contrast;
    scheme: Scheme | number;
}

const presetOptions = {
    systemNotify: true,
    titleSeparator: ' | ',
    mimetype: 'application/json',
    footer: Array<MenuItem>()
};

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
