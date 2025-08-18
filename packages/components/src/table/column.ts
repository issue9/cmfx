// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Column as ExportColumn } from '@cmfx/core';
import { JSX } from 'solid-js';

/**
 * 用于描述列的信息
 *
 * @typeParam T - 表示的是展示在表格中的单条数据的类型。
 */
export interface Column<T extends object> extends ExportColumn<T> {
    /**
     * 列标题
     *
     * 如果该值为空，则采用以下几种路径获取值：
     *  - label
     *  - id
     *
     * renderLabel 和 label 的区别在于，label 用于导出，只能是字符串，
     * 而 renderLabel 可以是组件类型。
     */
    renderLabel?: JSX.Element;

    /**
     * `colgroup>col` 的 CSS 类名
     */
    colClass?: string;

    /**
     * 为 `thead>tr>td` 和 `thead>tr>th` 指定的 CSS 类。
     */
    headClass?: string;

    /**
     * 为每个单元格指定类型。包括表头和普通的数据单元。
     *
     * NOTE: 如果存在 {@link Column#headClass}，那么 cellClass 将不会对表头中的单元格起作用；
     * NOTE: 不需要打印的列，可用 no-print 样式；
     */
    cellClass?: string;

    /**
     * 单元格内容的渲染
     *
     * 如果该值为空，则采用以下几种路径获取值：
     *  - content
     *  - T[id]
     *
     * renderContent 和 content 的区别在于，content 用于导出，只能是字符串，
     * 而 renderContent 可以是组件类型。
     */
    renderContent?: CellRenderFunc<T>;
}

/**
 * 渲染单元格的方法
 */
export interface CellRenderFunc<T extends object> {
    /**
     * @param id - 对应当前列 {@link Column#id} 的值；
     * @param val - 如果该 id 存在于 T 中，那返回其在 T 中的值，如果不存在则是 undefined；
     * @param obj - 表示是当前行的对象，其类型为 T；
     */
    <K extends keyof T>(id: string, val?: T[K], obj?: T): JSX.Element;
}
