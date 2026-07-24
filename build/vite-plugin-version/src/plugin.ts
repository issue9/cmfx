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
	 *
	 * @remarks
	 * 始终是相对于 vite.config.ts 中 publicDir 的。
	 */
	output?: string;

	/**
	 * 轮询间隔，单位毫秒
	 *
	 * @defaultValue 60000
	 */
	interval?: number;
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
export function version(options?: Options): Plugin<Options> {
	const opt = Object.assign(
		{ output: 'version.json', pkg: 'package.json', interval: 60000 },
		options,
	) as Required<Options>;

	// vite.config 中的 publicDir 配置项
	let pubDir: string;

	return {
		name: 'vite-plugin-cmfx-version',

		configResolved(config) {
			pubDir = config.publicDir;
		},

		async buildStart() {
			try {
				await fs.promises.mkdir(pubDir, { recursive: true }); // 确保 publicDir 存在

				// 从 package.json 中读取版本信息
				const src = await fs.promises.readFile(opt.pkg, 'utf-8');
				const obj = JSON.parse(src);
				const info = { version: obj.version, buildTime: new Date() } satisfies Info;

				// 写入版本文件到 publicDir
				const output = path.join(pubDir, opt.output);
				console.info(`输出版本文件至 ${output}`);
				await fs.promises.writeFile(output, JSON.stringify(info));

				// 复制 version_checker 到 publicDir，且要替换其中的 ${VERSION_FILE} 为实际的版本文件名
				const checkerSrc = path.join(__dirname, 'version_checker.js');
				let txt = await fs.promises.readFile(checkerSrc, 'utf-8');
				txt = txt.replace(/__VERSION_FILE__/, opt.output).replace(/__INTERVAL__/, opt.interval.toString());

				const checkerDest = path.join(pubDir, 'version_checker.js');
				await fs.promises.writeFile(checkerDest, txt);
			} catch (err) {
				throw new Error(`写入版本文件失败：${err}`);
			}
		},
	};
}
