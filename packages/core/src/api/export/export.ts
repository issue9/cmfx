// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { CellValue, ColumnDef, WriteOptions } from 'hucre';
import { toMarkdown, writeCsv, writeOds, writeXlsx } from 'hucre';

import type { CellRenderFunc, CellType, Column } from './column';
import { presetCellRenderFunc } from './column';
import { createDownloadLink } from './download';
import type { Page, Query } from './query';

/**
 * 从服务器获取数据的函数签名
 *
 * @typeParam T - 返回的行数据类型；
 * @typeParam Q - 查询参数的类型；
 */
export type FetchFunc<T extends object, Q extends Query> = (q: Q) => Promise<Page<T> | Array<T> | undefined>;

/**
 * 提供从 API 分页接口导出数据的方法
 *
 * @typeParam T - 每一行数据的类型；
 * @typeParam Q - 查询参数的类型；
 */
export class Exporter<T extends object, Q extends Query> {
	/**
	 * 支持可导出的文件扩展名
	 */
	static exts = ['.csv', '.xlsx', '.md', '.ods'] as const;

	/**
	 * 表格的列定义
	 *
	 * 这里的 content 主要是改为必选项
	 */
	readonly #columns: Array<Omit<Column<T>, 'content'> & { content: CellRenderFunc<T> }>;

	/**
	 * 表格的表头
	 */
	readonly #header: Array<string>;

	/**
	 * 表格的数据
	 */
	readonly #rows: Array<Array<CellValue>> = [];

	/**
	 * 构造函数
	 *
	 * @param cols - 对列的定义
	 */
	constructor(cols: Array<Column<T>>) {
		this.#columns = cols.map(col => {
			return {
				...col,
				content: col.content || presetCellRenderFunc,
			};
		});

		const header: Array<string> = [];
		for (const c of cols) {
			if (!c.isUnexported) {
				header.push(c.label ?? c.id.toString());
			}
		}
		this.#header = header;
	}

	/**
	 * 添加一至多行数据
	 */
	#append(...rows: Array<T>): void {
		for (const row of rows) {
			const line: Array<CellType> = [];
			for (const c of this.#columns) {
				if (c.isUnexported) {
					continue;
				}
				const val = (row[c.id as keyof T] ?? undefined) as Parameters<CellRenderFunc<T>>[1];
				line.push(c.content(c.id, val, row));
			}

			this.#rows.push(line.map(v => (v === undefined ? null : v)));
		}
	}

	/**
	 * 从服务器获取全部数据到当前浏览器
	 */
	async fetch(load: FetchFunc<T, Q>, q: Q): Promise<void> {
		const ret = await load(q);

		if (ret === undefined) {
			return undefined;
		} else if (Array.isArray(ret)) {
			this.#append(...ret);
		} else {
			this.#append(...ret.current);
		}
	}

	#buildHeader(): Array<ColumnDef> {
		return this.#header.map(h => ({ header: h }));
	}

	/**
	 * 导出数据
	 *
	 * 将 {@link Exporter#fetch} 下载的数据导出给用户。
	 *
	 * @param filename - 文件名，如果是 excel 和 ods，文件名部分也作为工作表的名称；
	 *
	 * NOTE: 这将通过浏览器创建一个自动下载的功能。
	 */
	async export(filename: `${string}${(typeof Exporter.exts)[number]}`): Promise<void> {
		const index = filename.lastIndexOf('.');
		const ext = filename.slice(index);
		const basename = filename.slice(0, index);

		switch (ext) {
			case '.csv': {
				const content = writeCsv(this.#rows, { headers: this.#header });
				createDownloadLink(content, filename, 'text/csv');
				break;
			}
			case '.xlsx': {
				const content = await writeXlsx(this.buildWriteOptions(basename));
				createDownloadLink(
					content.buffer as ArrayBuffer,
					filename,
					'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				);
				break;
			}
			case '.md': {
				const sheet = {
					name: basename,
					columns: this.#buildHeader(),
					rows: this.#rows,
				};
				const content = toMarkdown(sheet);
				createDownloadLink(content, filename, 'text/markdown');
				break;
			}
			case '.ods': {
				const content = await writeOds(this.buildWriteOptions(basename));
				createDownloadLink(content.buffer as ArrayBuffer, filename, 'application/vnd.oasis.opendocument.spreadsheet');
				break;
			}
		}
	}

	buildWriteOptions(basename: string): WriteOptions {
		const now = new Date();
		return {
			sheets: [
				{
					name: basename,
					columns: this.#buildHeader(),
					rows: this.#rows,
				},
			],
			properties: {
				title: basename,
				created: now,
				modified: now,
			},
		};
	}
}
