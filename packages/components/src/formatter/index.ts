// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Bits, units as bitUnits, createBits } from './bits';
import { Bytes, units as byteUnits, createBytes } from './bytes';

export const Formatter = {
	Bits,
	createBits,
	bitUnits,
	Bytes,
	createBytes,
	byteUnits,
};

export namespace Formatter {
	export type BitsProps = import('./bits').FormatterBitsProps;
	export type BitUnit = import('./bits').FormatterBitUnit;

	export type BytesProps = import('./bytes').FormatterBytesProps;
	export type ByteUnit = import('./bytes').FormatterByteUnit;
}
