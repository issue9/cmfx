// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Config, DictLoader, DisplayStyle, PickOptional } from '@cmfx/core';
import { Component } from 'solid-js';
import { default as IconLoading } from '~icons/cmfx/loading';

import { BaseProps, joinClass, Mode, readScheme, Scheme } from '@components/base';
import styles from './style.module.css';

/**
 * 组件库的全局配置项
 */
export interface Options {
	/**
	 * 提供用于保存配置项到 {@link Storage} 对象的接口
	 */
	config: Config;

	/**
	 * 项目的 LOGO
	 */
	logo: string;

	/**
	 * 表示加载状态的组件
	 *
	 * @remarks
	 * 在页面未加载完成之前会显示此组件的内容。一般为一个动态的图标组件。
	 *
	 * @defaultValue `~icons/cmfx/loading`
	 */
	loading?: Component<BaseProps>;

	/**
	 * 是否使用系统通知，当在 {@link config} 中存在时，当前值将被忽略。
	 *
	 * @defaultValue false
	 */
	systemNotify?: boolean;

	/**
	 * 字体大小，当在 {@link config} 中存在时，当前值将被忽略。
	 */
	fontSize?: string;

	/**
	 * 默认的主题样式，当在 {@link config} 中存在时，当前值将被忽略。
	 *
	 * @remarks
	 * 如果是字符串，会尝试从 {@link schemes} 中获取对应的 {@link Scheme} 对象。
	 *
	 * @defaultValue schemes 的第一个元素或是从 html 读取对应的变量作为默认值
	 */
	scheme?: string | Scheme;

	/**
	 * 支持的主题列表
	 *
	 * @remarks
	 * {@link ../theme/schemes#schemes} 下定义部分主题可以直接在此处使用。
	 *
	 * @defaultValue `new Map()`
	 */
	schemes?: Map<string, Scheme>;

	/**
	 * 默认的主题模式，当在 {@link config} 中存在时，当前值将被忽略。
	 *
	 * @defaultValue 'system'
	 */
	mode?: Mode;

	/**
	 * 动画效果的时长，单位为 ms。当在 {@link config} 中存在时，当前值将被忽略。
	 *
	 * @defaultValue 300
	 */
	transitionDuration?: number;

	/**
	 * 初始的本地化语言 ID，当在 {@link config} 中存在时，当前值将被忽略。
	 *
	 * @defaultValue `document.documentElement.lang || navigator.language || (navigator.languages.length > 0 ? navigator.languages[0] : 'en')`
	 */
	locale?: string;

	/**
	 * 本地化的量词风格，当在 {@link config} 中存在时，当前值将被忽略。
	 *
	 * @defaultValue 'short'
	 */
	displayStyle?: DisplayStyle;

	/**
	 * 指定时区，当在 {@link config} 中存在时，当前值将被忽略。
	 *
	 * @defaultValue `Intl.DateTimeFormat().resolvedOptions().timeZone`
	 */
	timezone?: string;

	/**
	 * 提示框，通知栏等元素在界面上的默认停留时间。单位为 ms。当在 {@link config} 中存在时，当前值将被忽略。
	 *
	 * @defaultValue 5000
	 */
	stays?: number;

	/**
	 * 当前支持的语言列表以及加载方法
	 */
	messages: Record<string, Array<DictLoader>>;

	/**
	 * 网站的标题
	 *
	 * @remarks
	 * 如果不为空，会和 {@link titleSeparator} 组成页面标题的后缀。
	 */
	title: string;

	/**
	 * 网页标题的分隔符
	 *
	 * @defaultValue ' - '
	 */
	titleSeparator?: string;

	/**
	 * 分页符中页码选项的默认值
	 *
	 * @defaultValue [10, 20, 50, 100]
	 */
	pageSizes?: Array<number>;

	/**
	 * 表格等需要分页对象的每页默认数量
	 *
	 * @defaultValue 20
	 */
	pageSize?: number;
}

/**
 * 提供了 {@link Options} 对象的所有可选项的默认值
 */
export const presetOptions: PickOptional<Options> = {
	fontSize: '14px',
	systemNotify: false,
	locale:
		document.documentElement.lang ||
		navigator.language ||
		(navigator.languages.length > 0 ? navigator.languages[0] : 'en'),
	loading: (props: BaseProps) => (
		<div class={styles.loading} role="progressbar">
			<IconLoading style={props.style} class={joinClass(props.palette, props.class)} aria-hidden={true} />
		</div>
	),
	displayStyle: 'short',
	scheme: '',
	schemes: new Map([]),
	transitionDuration: 300,
	mode: 'system',
	timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
	stays: 5000,
	titleSeparator: ' - ',
	pageSizes: [10, 20, 50, 100],
	pageSize: 20,
} as const;

/**
 * 由 {@link requiredOptions} 返回的对象，所有字段都是必填的。同时也是 useOptions 的返回类型。
 */
export type ReqOptions = Required<Omit<Options, 'scheme'> & { scheme: Scheme }>;

/**
 * 将 opt 转换为 ReqOptions 类型
 *
 * @remarks
 * 如果 opt 中存在某个属性，则使用 opt 中的值，否则使用 presetOptions 中的默认值。
 */
export function requiredOptions(opt: Options): ReqOptions {
	const o = Object.assign(presetOptions, opt) as Required<Options>;

	let scheme: Scheme | undefined;
	if (!o.scheme) {
		// 未指定主题，则尝试从 CSS 读取或是从主题列表中拿第一个。
		scheme = o.schemes.size <= 0 ? readScheme() : o.schemes.values().next().value;
	} else {
		scheme = typeof o.scheme === 'string' ? o.schemes.get(o.scheme) : o.scheme;
	}

	if (!scheme) {
		throw new Error('无法正确初始化主题的相关内容，请确保 scheme 和 schemes 是否正确');
	}

	o.scheme = scheme; // 此处保证 o.scheme 只能为 Scheme 类型

	return o as ReqOptions;
}
