// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

// vite.config.ts 的一些公共配置

import fs from 'node:fs';
import path from 'node:path';

/**
 * 生成产出文件的文件头
 *
 * @param pkg - 为所在包的 package.json 文件，直接使用以下语句导入即可：
 * ```ts
 * import pkg from './package.json' with {type: 'json'}
 * ```
 */
export function buildPostBanner(pkg: { name: string; version: string; homepage: string; license: string }) {
	return (chunk: { isEntry: boolean }): string => {
		if (chunk.isEntry) {
			return `/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.homepage}
 * ${pkg.license} licensed
 */`;
		} else {
			return '';
		}
	};
}

/**
 * 提供一个简单的复制文件 vite 插件
 *
 * @param targets - 要复制的文件列表；
 * @param targets.src - 源文件路径，如果是相对路径，则是相对于项目的 root；
 * @param targets.dest - 目标文件路径，如果是相对路径，则是相对于项目的 root；
 * @param targets.transform - 可选的内容转换函数；
 */
export function vitePluginCopyFile(
	targets: Array<{ src: string; dest: string; transform?: (content: string) => string }>,
) {
	let config: { root: string };

	return {
		name: 'vite-plugin-copy',
		apply: 'build',

		configResolved(c: { root: string }) {
			config = c;
		},

		async writeBundle() {
			for (const { src, dest, transform } of targets) {
				const from = path.isAbsolute(src) ? src : path.resolve(config.root, src);
				const { base } = path.parse(from);
				const to = path.join(path.isAbsolute(dest) ? dest : path.resolve(config.root, dest), base);

				if (!transform) {
					fs.copyFile(from, to, err => {
						if (err) {
							console.error(`将文件从 ${from} 复制到 ${to} 是发生了如下错误：`, err);
						} else {
						}
					});
				} else {
					const data = await fs.promises.readFile(from, 'utf-8');
					const transformedData = transform(data);
					await fs.promises.writeFile(to, transformedData, 'utf-8');
				}

				console.info(`成功将文件从 ${from} 复制到 ${to}`);
			}
		},
	};
}
