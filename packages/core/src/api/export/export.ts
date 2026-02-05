// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import xlsx from 'xlsx';

import { Page, Query } from '@core/api';
import { type CellRenderFunc, type CellType, type Column, isCellType } from './column';

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
	static exts = ['.csv', '.xlsx', '.numbers', '.ods'];

	readonly #sheet: xlsx.WorkSheet;
	readonly #columns: Array<Column<T>>;

	/**
	 * 构造函数
	 *
	 * @param cols - 对列的定义
	 */
	constructor(cols: Array<Column<T>>) {
		this.#columns = cols;

		const row: Array<string> = [];
		for (const c of cols) {
			if (!c.isUnexported) {
				row.push(c.label ?? c.id.toString());
			}
		}
		this.#sheet = xlsx.utils.aoa_to_sheet([row]);
	}

	/**
	 * 添加一至多行数据
	 */
	#append(...rows: Array<T>): void {
		for (const row of rows) {
			const data: Array<CellType> = [];
			for (const c of this.#columns) {
				if (c.isUnexported) {
					continue;
				}
				const val = (row[c.id as keyof T] ?? undefined) as Parameters<CellRenderFunc<T>>[1];
				const item = c.content ? c.content(c.id, val, row) : isCellType(val) ? val : val ? val.toString() : undefined;
				data.push(item);
			}

			xlsx.utils.sheet_add_aoa(this.#sheet, [data], { origin: -1 });
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

	/**
	 * 导出数据
	 *
	 * 将 {@link Exporter#fetch} 下载的数据导出给用户。
	 *
	 * @param filename - 文件名，如果是 excel，也作为工作表的名称；
	 * @param lang - 语言；
	 * @param ext - 后缀名，根据此值生成不同类型的文件；
	 * @param appName - 应用名称；
	 * @param appVersion - 应用版本；
	 *
	 * NOTE: 这将通过浏览器创建一个自动下载的功能。
	 */
	export(
		filename: string,
		ext: (typeof Exporter.exts)[number],
		lang?: string,
		appName?: string,
		appVersion?: string,
	): void {
		const book = xlsx.utils.book_new(this.#sheet, filename);
		const d = new Date();
		book.Props = {
			ModifiedDate: d,
			CreatedDate: d,
			Language: lang,
			Application: appName,
			AppVersion: appVersion,
		};
		xlsx.writeFile(book, filename + ext);
	}
}
