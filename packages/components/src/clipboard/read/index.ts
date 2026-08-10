// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

// NOTE: Clipboard 是全局类型名

import { ClipboardR as C, type ClipboardReaderProps, type ClipboardReaderRef } from './root';

export const ClipboardReader = C;

export namespace ClipboardReader {
	export type Ref = ClipboardReaderRef;
	export type Props = ClipboardReaderProps;
}
