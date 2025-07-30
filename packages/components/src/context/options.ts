// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { DictLoader, DisplayStyle, Mimetype, Problem } from '@cmfx/core';

import { Mode, Scheme } from '@/base';

/**
* 组件库的全局配置项
*/
export interface Options {
    /**
     * 该项目的唯一 ID
     */
    id: string;

    /**
     * 一些配置项的保存位置
     */
    storage: Storage;

    /**
     * 默认的配置名
     *
     * 当处于多用户环境时，每个用户可能有不同的本地配置，此值可作为默认值使用。
     */
    configName: string | number;

    /**
     * 默认的主题样式，当在 {@link Options#storage} 中存在时，当前值将被忽略。
     *
     * 如果是字符串，会尝试从 {@link Options#schemes} 中获取对应的 {@link Scheme} 对象。
     */
    scheme?: string | Scheme;

    /**
     * 支持的主题列表
     */
    schemes?: Map<string, Scheme>;

    /**
     * 默认的主题模式，当在 storage 中存在时，当前值将被忽略。
     */
    mode?: Mode;

    /**
     * 初始的本地化语言 ID，当在 storage 中存在时，当前值将被忽略。
     */
    locale: string;

    /**
     * 本地化的量词风格，当在 storage 中存在时，当前值将被忽略。
     */
    displayStyle: DisplayStyle;

    /**
     * 当前支持的语言列表以及加载方法
     */
    messages: Record<string, Array<DictLoader>>;

    /**
     * API 访问的基地址
     */
    apiBase: string;

    /**
     * API 令牌的续订地址
     */
    apiToken: string;

    /**
     * API 接收的媒体类型
     */
    apiAcceptType: Mimetype;

    /**
     * API 提交的媒体类型
     */
    apiContentType: Mimetype;

    /**
     * 网站的标题
     *
     * 如果不会空，会和 {@link Options#titleSeparator} 组成页面标题的后缀。
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

    /**
     * 提示框，通知栏等元素在界面上的默认停留时间，单位为 ms。
     */
    stays: number;

    /**
     * 将 {@link Problem} 作为错误进行处理，用户可以自行处理部分常用的错误，剩余的交由此方法处理。
     *
     * @param p 如果该值空，则会抛出异常；
     */
    outputProblem<P>(p?: Problem<P>): Promise<void>;
}
