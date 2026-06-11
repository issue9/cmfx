// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { AvailableEnumType } from '@components/base';
import { Radio as C } from './root';

export const Radio = C;

export namespace Radio {
	export type Props<T extends AvailableEnumType = string> = import('./root').RadioProps<T>;
	export type Ref = import('./root').RadioRef;
}
