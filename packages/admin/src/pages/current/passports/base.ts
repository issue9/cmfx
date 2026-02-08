// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { base32nopad, base64urlnopad } from '@scure/base';

const textEncoder = new TextEncoder();

export function encodeBase32(str: string): string {
	return base32nopad.encode(textEncoder.encode(str));
}

const textDecoder = new TextDecoder('utf-8');

export function decodeBase64(base64url: BufferSource): ArrayBuffer {
	if (typeof base64url === 'string') {
		return base64urlnopad.decode(base64url).buffer.slice(0) as ArrayBuffer;
	}
	return base64urlnopad.decode(textDecoder.decode(base64url)).buffer.slice(0) as ArrayBuffer;
}

export function encodeBase64(bytes: ArrayBuffer): string {
	return base64urlnopad.encode(new Uint8Array(bytes));
}
