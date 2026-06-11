// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { Result as C } from './root';

export const Result = C;

export namespace Result {
	export type Props = import('./root').ResultProps;
	export type Ref = import('./root').ResultRef;
}
