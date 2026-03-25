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
 * 复制文件的 vite 插件
 *
 * @param targets - 要复制的文件列表；
 * @param targets.src - 源文件路径，如果是相对路径，则是相对于项目的 root；
 * @param targets.dest - 目标目录的路径，如果是相对路径，则是相对于项目的 root；
 * @param targets.transform - 可选的内容转换函数；
 * @param targets.before - 是否在打包前执行，默认是在打包之后才执行复制；
 */
export function vitePluginCopyFile(
	targets: Array<{ src: string; dest: string; transform?: (content: string) => string; before?: boolean }>,
) {
	let config: { root: string }; // vite 的配置对象

	const copy = async (src: string, dest: string, transform?: (content: string) => string) => {
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
	};

	return {
		name: 'vite-plugin-copy',
		apply: 'build',

		configResolved(c: { root: string }) {
			config = c;
		},

		async buildStart() {
			for (const { src, dest, transform, before } of targets) {
				if (before) {
					await copy(src, dest, transform);
				}
			}
		},

		async writeBundle() {
			for (const { src, dest, transform, before } of targets) {
				if (!before) {
					await copy(src, dest, transform);
				}
			}
		},
	};
}
