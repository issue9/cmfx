// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Drawer } from '@cmfx/components';
import type { Type } from '@cmfx/vite-plugin-api';

export const floatingWidth: Drawer.RootProps['floating'] = 'lg';

export type FileObject<T> = Record<string, T>;

/**
 * 表示通过 import.meta.glob 加载的文本文件对象
 */
export type TextFileObject = FileObject<string>;

/**
 * 表示通过 import.meta.glob 加载的 api 文档对象
 */
export type APIFileObject = FileObject<Array<Type>>;

/**
 * 将 obj 转换为 Map 对象，其中键名只保留了语言 ID。
 */
export function fileObject2Map<T>(obj: FileObject<T>): Map<string, T> {
	const arr = Object.entries(obj).map(([k, v]) => {
		k = k.split('/').pop()!.split('\\').pop()!; // 去掉路径分隔符

		let index = k.indexOf('.');
		if (index >= 0) {
			k = k.slice(index + 1);
		}

		index = k.lastIndexOf('.');
		if (index >= 0) {
			k = k.slice(0, index);
		}

		return [k, v] satisfies [string, T];
	});
	return new Map(arr);
}
