// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Root as C } from './root';

export const Page = C;

export namespace Page {
	export type Props = import('./root').PageProps;
	export type Ref = import('./root').PageRef;
}
