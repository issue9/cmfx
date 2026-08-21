// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { AvailableEnumType } from '@cmfx/cdk';

import { Radio as C, type RadioProps, type RadioRef } from './root';

export const Radio = C;

export namespace Radio {
	export type Props<T extends AvailableEnumType = string> = RadioProps<T>;
	export type Ref = RadioRef;
}
