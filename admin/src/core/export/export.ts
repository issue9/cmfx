// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import xlsx from 'xlsx';

import { Page } from '@/core/api';
import { Column } from './column';

/**
 * 加载数据的函数签名
 *
 * @template T 返回的行数据类型；
 * @template Q 查询参数的类型；
 */
export interface LoadFunc<T extends object> {
    (): Promise<Page<T> | Array<T> | undefined>
}

/**
 * 导出对象需要实现的接口
 *
 * @template T 每一行数据的类型
 */
export class Exporter<T extends object> {
    #sheet: xlsx.WorkSheet;
    #columns: Array<Column<T>>;

    /**
     * 构造函数
     *
     * @param cols 对列的定义
     */
    constructor(cols: Array<Column<T>>) {
        this.#columns = cols;

        const row: Array<string> = [];
        for(const c of cols) {
            if (!c.isUnexported) {
                row.push(c.label ?? c.id);
            }
        }
        this.#sheet = xlsx.utils.aoa_to_sheet([row]);
    }

    /**
     * 添加一至多行数据
     */
    #append(...rows: Array<T>): void {
        for(const row of rows) {
            const data:Array<string> = [];
            for(const c of this.#columns) {
                if (c.isUnexported) {
                    continue;
                }

                const val = (row as any)[c.id];
                data.push(c.content ? c.content(c.id, val, row) : val);
            }

            xlsx.utils.sheet_add_aoa(this.#sheet, [data], {origin: -1});
        }
    }

    /**
     * 执行下载数据操作
     *
     * NOTE: 可多次调用。
     */
    async download(load: LoadFunc<T>): Promise<void> {
        const ret = await load();

        if (ret === undefined) {
            return undefined;
        }else if (Array.isArray(ret)) {
            this.#append(...ret);
        } else {
            this.#append(...ret.current);
        }
    }

    /**
     * 导出数据，即在浏览器中提供下载功能。
     *
     * @param filename 下载文件的文件名，如果是 excel，也作为工作表的名称。
     * @param ext 后缀名，根据此值生成不同类型的文件。
     */
    export(filename: string, ext: '.csv' | '.xlsx' | '.ods'): void {
        const book = xlsx.utils.book_new(this.#sheet, filename);
        book.Props = {
            ModifiedDate: new Date(),
        };
        xlsx.writeFile(book, filename + ext);
    }
}
