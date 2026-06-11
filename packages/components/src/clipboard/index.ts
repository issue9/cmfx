// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

// NOTE: Clipboard 是全局类型名

import { ClipboardAPI as C } from './root';

export const ClipboardAPI = C;

export namespace ClipboardAPI {
	export type Ref = import('./clipboard').ClipboardAPIRef;
	export type Props = import('./root').ClipboardAPIProps;
}
