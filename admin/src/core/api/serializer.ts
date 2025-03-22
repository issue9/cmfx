// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import YAML from 'yaml';
import TOML from 'smol-toml';

/**
 * 当前 API 支持的 mime type
 */
export const mimetypes = [
    'application/json',
    'application/yaml',
    'application/toml',
] as const;

export type Mimetype = typeof mimetypes[number];

export const serializers: Readonly<Map<Mimetype, Serializer>> = new Map<Mimetype, Serializer>([
    ['application/json', JSON],
    ['application/yaml', YAML],
    ['application/toml', TOML],
]);

/**
 * 以 {@link JSON} 为参照定义了序列化和反序列化的接口
 */
export interface Serializer {
    parse(_: string): unknown;
    stringify(_: unknown): string;
}
