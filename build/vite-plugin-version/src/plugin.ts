// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';

/**
 * 插件选项
 */
export interface Options {
	/**
	 * package.json 的文件地址
	 *
	 * @defaultValue './package.json'
	 */
	pkg?: string;

	/**
	 * 输出的文件名
	 *
	 * @defaultValue 'version.json'
	 */
	output?: string;
}

/**
 * 写入 {@link Options#output} 文件的版本信息
 */
export interface Info {
	/**
	 * 版本号
	 */
	version: string;

	/**
	 * 构建时间
	 */
	buildTime?: Date;
}

/**
 * 为项目生成版本信息
 */
export function version(options: Options): Plugin<Options> {
	options = Object.assign({ file: 'version.json', pkg: './package.json' }, options);

	return {
		name: 'vite-plugin-cmfx-version',

		writeBundle: async () => {
			const pkg = path.join(__dirname, options.pkg);
			const src = await fs.promises.readFile(pkg, 'utf-8');
			const obj = JSON.parse(src);

			const output = { version: obj.version, buildTime: new Date() } satisfies Info;
			await fs.promises.writeFile(path.join(__dirname, options.output), JSON.stringify(output));
		},
	};
}
