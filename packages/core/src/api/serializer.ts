// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { decode, encode } from 'cbor2';
import YAML from 'yaml';

/**
 * 当前 API 支持的 mime type
 */
export const mimetypes = [
    'application/json',
    'application/yaml',
    'application/cbor',
] as const;

export type Mimetype = typeof mimetypes[number];

const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

class CBORImpl implements Serializer {
    parse<T = unknown>(s: Uint8Array): T { return decode<T>(s); }
    stringify<T = unknown>(o: T): Uint8Array { return encode(o); }
}

class JSONImpl implements Serializer {
    parse<T = unknown>(s: Uint8Array): T { return JSON.parse(textDecoder.decode(s)); }
    stringify<T = unknown>(o: T): Uint8Array { return textEncoder.encode(JSON.stringify(o)); }
}

class YAMLImpl implements Serializer {
    parse<T = unknown>(s: Uint8Array): T { return  YAML.parse(textDecoder.decode(s)); }
    stringify<T = unknown>(o: T): Uint8Array { return textEncoder.encode(YAML.stringify(o)); }
}

export const serializers: ReadonlyMap<Mimetype, Serializer> = new Map<Mimetype, Serializer>([
    ['application/json', new JSONImpl()],
    ['application/yaml', new YAMLImpl()],
    ['application/cbor', new CBORImpl()],
]);

/**
 * 序列化和反序列化的接口
 */
export interface Serializer {
    parse<T = unknown>(_: Uint8Array): T;
    stringify<T = unknown>(_: T): Uint8Array;
}
