// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { RowArray, writeToBuffer } from '@fast-csv/format';

import type { Column, Exporter, Row } from './export';
import { download, getHeaderRow } from './export';

/**
 * CSV 格式的导出对象
 */
export class CSV<T extends Row> implements Exporter<T> {
    #columns: Array<Column<T>>;
    #data: Array<RowArray>;

    constructor(cols: Array<Column<T>>, cap: number) {
        this.#columns = cols;
        this.#data = new Array<RowArray>(cap);
        this.#data.push(getHeaderRow(cols));
    }

    append(...rows: T[]): void {
        for(const row of rows) {
            const data: RowArray = new Array<string>(this.#columns.length);
            for(const c of this.#columns) {
                const val = row[c.id] as any;
                data.push(c.content ? c.content(c.id, val, row) : val);
            }
            this.#data.push(data);
        }
    }

    async download(filename: string): Promise<void> {
        const buf = await writeToBuffer(this.#data);
        download(new File([buf], filename, {
            type: 'text/csv'
        }));
    }
}
