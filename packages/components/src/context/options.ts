// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { API, Problem } from '@cmfx/core';

export interface Options {
    /**
     * 网站的标题
     *
     * 如果不会空，会和 {@link Options#titleSeparator} 组成页面标题的后缀。
     */
    title: string;

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
     * 用于操作与后端操作的 API 对象
     */
    api: API;

    /**
     * 将 {@link Problem} 作为错误进行处理，用户可以自行处理部分常用的错误，剩余的交由此方法处理。
     *
     * @param p 如果该值空，则会抛出异常；
     */
    outputProblem<P>(p?: Problem<P>): Promise<void>;
}
