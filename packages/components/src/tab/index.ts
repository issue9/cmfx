// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Tab as C } from './root';
import type { TabItem, TabProps, TabRef } from './types';

export const Tab = C;

export namespace Tab {
	export type Props = TabProps;
	export type Ref = TabRef;
	export type Item = TabItem;
}
