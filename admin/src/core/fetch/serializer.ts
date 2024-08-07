// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 当前支持的 mime type
 */
export const mimetypes = ['application/json'] as const;

export type Mimetype = typeof mimetypes[number];

export const serializers: Readonly<Map<Mimetype, Serializer>> = new Map<Mimetype, Serializer>([
    ['application/json', JSON],
]);

/**
 * 以 JSON 为参照定义了序列化和反序列化的接口
 */
export interface Serializer {
    parse(_: string): unknown;
    stringify(_: unknown): string;
}
