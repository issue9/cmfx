// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

// vite.config.ts 的一些公共配置

/**
 * 生成产出文件的文件头
 *
 * @param pkg - 为所在包的 package.json 文件，直接使用以下语句导入即可：
 * ```ts
 * import pkg from './package.json' with {type: 'json'}
 * ```
 */
export function buildPostBanner(pkg: unknown) {
	return (chunk: {isEntry: boolean}): string => {
		if (chunk.isEntry) {
			return `/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.homepage}
 * ${pkg.license} licensed
 */`;
		}else {
			return '';
		}
	};
}
