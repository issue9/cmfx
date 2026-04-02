// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Drawer } from '@cmfx/components';
import type { Type } from '@cmfx/vite-plugin-api';

type FileObject<T> = Record<string, T>;

/**
 * 表示 markdown 文件加载后的对象
 */
export type MarkdownFileObject = FileObject<string>;

export type APIFileObject = FileObject<Array<Type>>;

export const floatingWidth: Drawer.RootProps['floating'] = 'lg';
