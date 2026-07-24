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
	filename?: string;

	/**
	 * 项目的源码路径
	 *
	 * @remarks
	 * 插件生成的代码会放在该目录下
	 * @defaultValue './src/version_checker'
	 */
	src?: string;

	/**
	 * 轮询间隔，单位毫秒
	 *
	 * @defaultValue 60000
	 */
	interval?: number;
}

/**
 * 写入 {@link Options#filename} 文件的版本信息
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

const checkerSrc = path.join(import.meta.dirname, 'version', 'checker.ts');
const initSrc = path.join(import.meta.dirname, 'version', 'init.ts');

/**
 * 为项目生成版本信息
 *
 * @remarks
 * 该插件会在 public 下生成一个版本信息文件，同时在源码目录下添加一个 version_checker 目录，
 * 目录下包含两个文件：
 * - checker.ts 用于轮询版本更新；
 * - init.ts 用于初始化版本信息；
 * 用户只需要调用 init 中的 initVersionCheckWorker 函数就可以了。
 */
export function version(options?: Options): Plugin<Options> {
	const opt = Object.assign(
		{ filename: 'version.json', pkg: 'package.json', src: './src/version_checker', interval: 60000 } satisfies Options,
		options,
	) as Required<Options>;

	// vite.config 中的 publicDir 配置项
	let pubDir: string;
	let srcDir: string; // 输出源码的位置

	return {
		name: 'vite-plugin-cmfx-version',

		configResolved(config) {
			pubDir = config.publicDir;
			srcDir = path.resolve(config.root, opt.src);
		},

		async buildStart() {
			try {
				await fs.promises.mkdir(pubDir, { recursive: true }); // 确保 publicDir 存在
				await fs.promises.mkdir(srcDir, { recursive: true }); // 确保 rootDir 存在

				// 从 package.json 中读取版本信息
				const src = await fs.promises.readFile(opt.pkg, 'utf-8');
				const obj = JSON.parse(src);
				const info = { version: obj.version, buildTime: new Date() } satisfies Info;

				// 写入版本文件到 publicDir
				const output = path.join(pubDir, opt.filename);
				console.info(`输出版本文件至 ${output}`);
				await fs.promises.writeFile(output, JSON.stringify(info));

				// 复制 checker.ts 到 rootDir，且要替换其中的 ${VERSION_FILE} 为实际的版本文件名
				let txt = await fs.promises.readFile(checkerSrc, 'utf-8');
				txt = txt.replace(/__VERSION_FILE__/, opt.filename).replace(/__INTERVAL__/, opt.interval.toString());
				const checkerDest = path.join(srcDir, 'checker.ts');
				await fs.promises.writeFile(checkerDest, txt);

				await fs.promises.copyFile(initSrc, path.join(srcDir, 'init.ts'));
			} catch (err) {
				throw new Error(`写入版本文件失败：${err}`);
			}
		},
	};
}
