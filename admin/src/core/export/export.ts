// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 导出数据的行对象
 */
export interface Row {
    [k: string]: unknown;
}

/**
 * 定义导出列的相关信息
 *
 * @template T 导出数据中每条数据的类型
 */
export interface Column<T extends Row> {
    /**
     * 导出列在对象 T 中的字段名，如果是自定义列，也可能不存在于实现的 T 中。
     */
    id: string;

    /**
     * 导出列的标题，如果为空将直接采用 id
     */
    title: string;

    /**
     * 导出列的转换方法，如果为空，表示直接采用对应在的值，或是空
     */
    content?: CellRenderFunc<T>;
}

/**
 * 渲染单元格的方法
 */
export interface CellRenderFunc<T extends Row> {
    /**
     * @param id 对应当前列 {@link Column#id} 的值；
     * @param val 如果该 id 存在于 T 中，那返回其在 T 中的值，如果不存在则是 undefined；
     * @param obj 表示是当前行的对象，其类型为 T；
     */
    (id: string, val?: T[keyof T], obj?: T): string | number | undefined;
}

/**
 * 导出对象需要实现的接口
 *
 * @template T 每一行数据的类型
 */
export interface Exporter<T extends Row> {
    /**
     * 添加一至多行数据
     */
    append(...row: Array<T>): void;

    /**
     * 对添加的数据创建下载功能
     *
     * @param filename 下载文件的文件名
     */
    download(filename: string): Promise<void>;
}

/**
 * 创建下载功能
 */
export function download(file: File) {
    const obj = URL.createObjectURL(file);

    const link = document.createElement('a');
    link.href = obj;
    link.download = file.name;
    document.body.append(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(obj);
}

export function getHeaderRow<T extends Row>(cols: Array<Column<T>>) {
    const row = new Array<string>(cols.length);
    for(const c of cols) {
        row.push(c.title ?? c.id);
    }
    return row;
}
