// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 定义导出列的相关信息
 *
 * @typeParam T - 导出数据中每行数据的类型
 */
export interface Column<T extends object> {
    /**
     * 导出列在对象 T 中的字段名，如果是自定义列，也可以是不存在于 T 中。
     */
    id: string | keyof T;

    /**
     * 导出列的标题，如果为空将直接采用 id
     */
    label?: string;

    /**
     * 如果导出列的内容需要进行转换，可以指定此方法。
     */
    content?: CellRenderFunc<T>;

    /**
     * 该列不需要导出
     */
    isUnexported?: boolean;
}

/**
 * 渲染单元格的方法
 */
export interface CellRenderFunc<T extends object> {
    /**
     * @param id - 同 {@link Column#id}；
     * @param val - 如果该 id 存在于 T 中，那返回其在 T 中当前行的值，如果不存在则是 undefined；
     * @param obj - 表示是当前行的对象，其类型为 T；
     */
    <K extends keyof T>(id: string | K, val?: K extends keyof T ? T[K] : unknown, obj?: T): string | number | undefined;
}
