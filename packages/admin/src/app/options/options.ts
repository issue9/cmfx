// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { BaseProps, DrawerProps, Layout, Mode, Scheme, presetOptions as xpo } from '@cmfx/components';
import { DictLoader, DisplayStyle, PickOptional } from '@cmfx/core';
import { Component } from 'solid-js';

import { API, sanitizeAPI } from './api';
import type { MenuItem, Routes } from './route';

/**
 * 未登录状态下配置名称
 */
export const presetConfigName = '0';

/**
 * 项目的基本配置
 */
export interface Options {
	/**
	 * 该 app 的 ID
	 *
	 * @remarks
	 * 用于保证同框架的不同应用在浏览器中保存的数据具有唯一性。
	 */
	id: string;

	/**
	 * 页面布局，当在配置项中存在时，当前值将被忽略。
	 *
	 * @defaultValue 'vertical'
	 */
	layout?: Layout;

	/**
	 * 侧边栏和顶部工具栏是否拥有浮动效果。当在配置项中存在时，当前值将被忽略。
	 *
	 * @defaultValue false
	 */
	float?: boolean;

	/**
	 * 整个页面的最大宽度，如果为零值，表示不设置。当在配置项中存在时，当前值将被忽略。
	 *
	 * @defaultValue 0
	 */
	width?: number;

	/**
	 * 网站的标题
	 */
	title: string;

	/**
	 * token 保存的位置
	 *
	 * @defaultValue sessionStorage
	 */
	tokenStorage?: Storage;

	/**
	 * 主题模式，当在配置项中存在时，当前值将被忽略。
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
	 * 当前使用的主题，必须存在于 schemes 中。当在配置项中存在时，当前值将被忽略。
	 *
	 * @defaultValue ''
	 */
	scheme?: string;

	/**
	 * LOGO，URL 格式
	 */
	logo: string;

	loading?: Component<BaseProps>;

	/**
	 * 采用系统通知
	 *
	 * @remarks
	 * 该功能需要在 https 下才有效，否则依然会采用内部的通知界面。当在配置项中存在时，当前值将被忽略。
	 *
	 * @defaultValue false
	 */
	systemNotify?: boolean;

	/**
	 * 替换浏览器的 alert、confirm 和 prompt 对话框
	 *
	 * @defaultValue false
	 */
	systemDialog?: boolean;

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
	 * @remarks
	 * 会按顺序显示大工具栏上
	 *
	 * @defaultValue []
	 */
	toolbar?: Array<Component>;

	/**
	 * 用户菜单
	 *
	 * @defaultValue []
	 */
	userMenus?: Array<MenuItem>;

	/**
	 * 指定本地化文本的加载方式
	 *
	 * @remarks
	 * 并不会自动加载内置的本地化对象，也需要在此指定。
	 */
	messages: Record<string, Array<DictLoader>>;

	/**
	 * 默认的本地化语言。当在配置项中存在时，当前值将被忽略。
	 *
	 * @defaultValue `document.documentElement.lang || navigator.language || (navigator.languages.length > 0 ? navigator.languages[0] : 'en')`
	 */
	locale?: string;

	/**
	 * 一些与本地化相关的单位名称的显示方式，说明可参考 {@link DisplayStyle}。当在配置项中存在时，当前值将被忽略。
	 *
	 * @defaultValue 'short'
	 */
	displayStyle?: DisplayStyle;

	/**
	 * 指定时区。当在配置项中存在时，当前值将被忽略。
	 *
	 * @defaultValue `Intl.DateTimeFormat().resolvedOptions().timeZone`
	 */
	timezone?: string;

	/**
	 * 通知等元素的停留时间。当在配置项中存在时，当前值将被忽略。
	 *
	 * @defaultValue 5000
	 */
	stays?: number;
}

// 大部分的默认值在 @cmfx/components 中是已经定义过的。
const presetOptions: Readonly<PickOptional<Options>> = {
	tokenStorage: sessionStorage,
	layout: 'vertical',
	float: false,
	width: 0,
	loading: xpo.loading,
	systemDialog: xpo.systemDialog,
	systemNotify: xpo.systemDialog,
	titleSeparator: xpo.titleSeparator,
	floatingMinWidth: 'lg',
	mode: xpo.mode,
	scheme: '',
	schemes: xpo.schemes,
	toolbar: [],
	userMenus: [],
	locale: xpo.locale,
	displayStyle: xpo.displayStyle,
	timezone: xpo.timezone,
	stays: xpo.stays,
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
