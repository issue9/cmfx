// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

// NOTE: Clipboard 是全局类型名

import { ClipboardW as C, type ClipboardWriterProps, type ClipboardWriterRef } from './root';

export const ClipboardWriter = C;

export namespace ClipboardWriter {
	export type Ref = ClipboardWriterRef;
	export type Props = ClipboardWriterProps;
}
