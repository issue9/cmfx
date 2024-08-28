// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Column as ExportColumn } from '@/core';

/**
 * 用于描述列的信息
 *
 * @template T 表示的是展示在表格中的单条数据的类型。
 */
export interface Column<T extends object> extends ExportColumn<T> {
    /**
     * 列标题
     *
     * 如果该值为空，则采用以下几种路径获取值：
     *  - label
     *  - id
     */
    renderLabel?: JSX.Element;

    /**
     * 为于表头中的单元格指定 CSS 类。
     */
    headClass?: string;

    /**
     * 为每个单元格指定类型。包括表头和普通的数据单元。
     *
     * NOTE: 如果存在 {@link Column#headClass}，那么 cellClass 将不会对表头中的单元格起作用。
     */
    cellClass?: string;

    /**
     * 单元格内容的渲染
     *
     * 如果该值为空，则采用以下几种路径获取值：
     *  - content
     *  - T[id]
     */
    renderContent?: CellRenderFunc<T>;
}

/**
 * 渲染单元格的方法
 */
export interface CellRenderFunc<T extends object> {
    /**
     * @param id 对应当前列 {@link Column#id} 的值；
     * @param val 如果该 id 存在于 T 中，那返回其在 T 中的值，如果不存在则是 undefined；
     * @param obj 表示是当前行的对象，其类型为 T；
     */
    <K extends keyof T>(id: string, val?: T[K], obj?: T): JSX.Element;
}
