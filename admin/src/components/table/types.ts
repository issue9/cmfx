// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { ElementProp } from '@/components/base';

/**
 * 用于描述列的信息
 *
 * T 表示的是展示在表格中的单条数据的类型。
 */
export interface Column<T extends object> {
    /**
     * 该列的 ID，一般对应展示数据的字段名
     */
    id: string;

    /**
     * 列标题
     */
    label?: ElementProp;

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
     */
    render?: CellRenderFunc<T>;
}

/**
 * CellRenderFunc 渲染单元格的方法
 */
export interface CellRenderFunc<T extends object> {
    /**
     * @param id 对应当前列 {@link Column#id} 的值；
     * @param val 如果该 id 存在于 T 中，那返回其在 T 中的值，如果不存在则是 undefined；
     * @param obj 表示是当前行的对象，其类型为 T；
     */
    (id: string, val?: unknown, obj?: T): JSX.Element;
}
