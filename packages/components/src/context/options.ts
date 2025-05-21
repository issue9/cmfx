// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Contrast, DictLoader, Mimetype, Mode, Problem, Scheme, UnitStyle } from '@cmfx/core';

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
     * 默认的主题样式，当在 storage 中存在时，当前值将被忽略。
     */
    scheme: Scheme | number;

    /**
     * 默认的主题明暗度，当在 storage 中存在时，当前值将被忽略。
     */
    contrast: Contrast;

    /**
     * 默认的主题模式，当在 storage 中存在时，当前值将被忽略。
     */
    mode: Mode;

    /**
     * 初始的本地化语言 ID，当在 storage 中存在时，当前值将被忽略。
     */
    locale: string;

    /**
     * 本地化的量词风格，当在 storage 中存在时，当前值将被忽略。
     */
    unitStyle: UnitStyle;

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
     * 是否替换浏览器提供的 alert、prompt 和 confirm 三个对话框
     */
    systemDialog?: boolean;

    /**
     * 将 {@link Problem} 作为错误进行处理，用户可以自行处理部分常用的错误，剩余的交由此方法处理。
     *
     * @param p 如果该值空，则会抛出异常；
     */
    outputProblem<P>(p?: Problem<P>): Promise<void>;
}
