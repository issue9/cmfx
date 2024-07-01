// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import localforage from 'localforage';

import { API, checkAPI } from './api';
import type { Locales } from './locales';
import { MenuItem, checkMenus } from './page';
import type { Routes } from './route';
import type { Theme } from './theme';

const siteTitleName = 'site_title';
const logoName = 'logo';

/**
 * 基本配置
 */
export interface Options {
    /**
     * 网站的标题
     *
     * 该值会被保存在 localforage 之中，如果在 localforage 存在值，则此设置将不启作用。
     */
    title: string

    /**
     * 默认的主题
     */
    theme: Theme

    /**
     * 默认的 LOGO
     *
     * 该值会被保存在 localforage 之中，如果在 localforage 存在值，则此设置将不启作用。
     */
    logo: string

    /**
     * 后台需要用到的 API 地址，基于 baseURL。
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

    /**
     * 数据类型
     *
     * 比如 application/json、application/xml 等。
     */
    mimetype?: string

    /**
     * 与本地化相关的一些设置
     */
    locales: Locales
}

const presetOptions = {
    titleSeparator: ' | ',
    mimetype: 'application/json',
    footer: Array<MenuItem>()
};

/**
 * 根据 o 生成一个完整的 Options 对象，且会检测字段是否正确。
 *
 * @param o 原始的对象
 */
export async function build(o: Options): Promise<Required<Options>> {
    const siteTitle = await localforage.getItem<string>(siteTitleName);
    if (siteTitle) {
        o.title = siteTitle;
    }
    if (o.title.length === 0) {
        throw 'title 不能为空';
    }

    const logo = await localforage.getItem<string>(logoName);
    if (logo) {
        o.logo = logo;
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
    checkMenus([], opt.menus);
    if (opt.footer) { checkMenus([], opt.footer); }
    await setLogo(o.logo);
    await setTitle(o.title);

    return {
        ...opt,

        get logo() { return opt.logo; },
        set logo(l: string) {
            opt.logo = l;
            setLogo(l);
        },

        get title() { return opt.title; },
        set title(v: string) {
            opt.title = v;
            setTitle(v);
        }
    };
}

async function setLogo(logo: string) {
    await localforage.setItem(logoName, logo);
}

async function setTitle(title: string) {
    await localforage.setItem(siteTitleName, title);
}
