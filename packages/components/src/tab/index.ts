// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Tab as C } from './root';

export const Tab = C;

export namespace Tab {
	export type Props = import('./types').TabProps;
	export type Ref = import('./types').TabRef;
	export type Item = import('./types').TabItem;
}
