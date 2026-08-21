// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Bits, units as bitUnits, createBits, type FormatterBitsProps, type FormatterBitUnit } from './bits';
import { Bytes, units as byteUnits, createBytes, type FormatterBytesProps, type FormatterByteUnit } from './bytes';

export const Formatter = {
	Bits,
	createBits,
	bitUnits,
	Bytes,
	createBytes,
	byteUnits,
};

export namespace Formatter {
	export type BitsProps = FormatterBitsProps;
	export type BitUnit = FormatterBitUnit;

	export type BytesProps = FormatterBytesProps;
	export type ByteUnit = FormatterByteUnit;
}
