// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Config, DictLoader, DisplayStyle } from '@cmfx/core';

import { Mode, Scheme } from '@/base';

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
     * 是否采用系统对话框
     */
    systemDialog: boolean;

    /**
     * 是否采用系统通知
     */
    systemNotify: boolean;

    /**
     * 默认的主题样式，当在 {@link config} 中存在时，当前值将被忽略。
     *
     * @remarks
     * 如果是字符串，会尝试从 {@link schemes} 中获取对应的 {@link Scheme} 对象。
     */
    scheme?: string | Scheme;

    /**
     * 支持的主题列表
     *
     * {@link ../theme/schemes#schemes} 下定义部分主题可以直接在此处使用。
     */
    schemes?: Map<string, Scheme>;

    /**
     * 默认的主题模式，当在 {@link config} 中存在时，当前值将被忽略。
     */
    mode?: Mode;

    /**
     * 初始的本地化语言 ID
     *
     * @remarks
     * 当在 {@link config} 中存在时，当前值将被忽略。
     * 如果未指定，则会依次从以下顺序读取配置：
     * - html.lang 属性；
     * - 浏览器的语言设置；
     */
    locale?: string;

    /**
     * 本地化的量词风格，当在 {@link config} 中存在时，当前值将被忽略。
     */
    displayStyle: DisplayStyle;

    /**
     * 时区，当在 {@link config} 中存在时，当前值将被忽略。
     */
    timezone?: string;

    /**
     * 提示框，通知栏等元素在界面上的默认停留时间
     *
     * @remarks
     * 单位为 ms。当在 {@link config} 中存在时，当前值将被忽略。
     */
    stays?: number;

    /**
     * 当前支持的语言列表以及加载方法
     */
    messages: Record<string, Array<DictLoader>>;

    /**
     * 网站的标题
     *
     * @remarks 如果不为空，会和 {@link titleSeparator} 组成页面标题的后缀。
     */
    title: string;

    /**
     * 网页标题的分隔符
     */
    titleSeparator: string;

    /**
     * 分页符中页码选项的默认值
     */
    pageSizes: Array<number>;

    /**
     * 表格等需要分页对象的每页默认数量
     */
    pageSize: number;
}
