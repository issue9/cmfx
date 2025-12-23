// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { DrawerProps, Mode, Scheme } from '@cmfx/components';
import { DictLoader, DisplayStyle, Hotkey, PickOptional } from '@cmfx/core';

import { API, sanitizeAPI } from './api';
import type { MenuItem, Routes } from './route';

/**
 * 项目的基本配置
 */
export interface Options {
    /**
     * 该 app 的 ID
     *
     * @remarks 用于保证同框架的不同应用在浏览器中保存的数据具有唯一性。
     */
    id: string;

    /**
     * 配置内容在 storage 中的名称
     *
     * @defaultValue '0'
     */
    configName?: string;

    /**
     * 网站的标题
     */
    title: string;

    /**
     * 保存本地数据的位置
     *
     * @defaultValue localStorage
     */
    storage?: Storage;

    /**
     * 主题模式
     *
     * @defaultValue 'system'
     */
    mode?: Mode;

    /**
     * 可用的主题列表
     *
     * @defaultValue `new Map()`
     */
    schemes?: Map<string, Scheme>;

    // NOTE: scheme 不采用在 schemes 中的索引，而是对应的实例值，
    // 这样的做的好处是在改变 schemes 的值时，scheme 依然是有意义的。
    // 且在 @cmfx/components 的配置中也是采用 Scheme 对象的值保存的。

    /**
     * 当前使用的主题，必须存在于 schemes 中。
     *
     * @defaultValue ''
     */
    scheme?: string;

    /**
     * LOGO，URL 格式
     */
    logo: string;

    /**
     * 采用系统通知
     *
     * @remarks
     * 该功能需要在 https 下才有效，否则依然会采用内部的通知界面。
     *
     * @defaultValue false
     */
    systemNotify?: boolean;

    /**
     * 替换浏览器的 alert、confirm 和 prompt 对话框
     *
     * @defaultValue false
     */
    systemDialog?: boolean

    /**
     * 后台需要用到的 API 地址
     */
    api: API;

    /**
     * 标题中的分隔符
     *
     * @defaultValue ' - '
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
     * 侧边栏在小于此值时将变为浮动状态
     *
     * @defaultValue 'lg'
     */
    floatingMinWidth?: Exclude<DrawerProps['floating'], boolean>;

    /**
     * 定义了工具栏上的按钮
     *
     * @remarks 键名定义了需要在工具栏上出现的按钮；键值则定义了该工具栏对应的快捷键；
     *
     * 目前的按钮可以是以下值：
     *  - search 搜索，登录之后有效；
     *  - clear 清除缓存的菜单；
     *  - fullscreen 全屏；
     *
     * NOTE: 默认为显示全部的按钮，如果不想显示任何按钮，应该赋值一个长度为零的空对象。
     *
     * @defaultValue 所有项
     */
    toolbar?: Map<'fullscreen' | 'search' | 'clear', Hotkey | undefined>;

    /**
     * 用户菜单
     */
    userMenus: Array<MenuItem>;

    /**
     * 指定本地化文本的加载方式
     *
     * @remarks
     * 并不会自动加载内置的本地化对象，也需要在此指定。
     */
    messages: Record<string, Array<DictLoader>>;

    /**
     * 默认的本地化语言
     *
     * @defaultValue `document.documentElement.lang || navigator.language || (navigator.languages.length > 0 ? navigator.languages[0] : 'en')`
     */
    locale?: string;

    /**
     * 一些与本地化相关的单位名称的显示方式，说明可参考 {@link DisplayStyle}
     *
     * @defaultValue 'short'
     */
    displayStyle?: DisplayStyle;

    /**
     * 指定时区
     *
     * @defaultValue `Intl.DateTimeFormat().resolvedOptions().timeZone`
     */
    timezone?: string;

    /**
     * 通知等元素的停留时间
     *
     * @defaultValue 5000
     */
    stays?: number;
}

const presetOptions: Readonly<PickOptional<Options>> = {
    storage: window.localStorage,
    configName: '0',
    systemDialog: false,
    systemNotify: false,
    titleSeparator: ' - ',
    floatingMinWidth: 'lg',
    mode: 'system',
    scheme: '',
    schemes: new Map(),
    toolbar: new Map([
        ['fullscreen', new Hotkey('f', 'control')],
        ['search', new Hotkey('k', 'control')],
        ['clear', undefined],
    ]),
    locale: document.documentElement.lang
        || navigator.language
        || (navigator.languages.length > 0 ? navigator.languages[0] : 'en'),
    displayStyle: 'short',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    stays: 5000,
} as const;

type ReqOptions = Required<Omit<Options, 'api'>> & { api: Required<API> };

/**
 * 根据 o 生成一个完整的 {@link Options} 对象，且会检测字段是否正确。
 *
 * @param o - 原始的对象
 */
export function build(o: Options): ReqOptions {
    const opt = Object.assign({}, presetOptions, o) as Required<Options>;
    opt.api = sanitizeAPI(opt.api);
    return opt as ReqOptions;
}
