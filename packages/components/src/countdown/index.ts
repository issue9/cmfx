// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Countdown as C, type CountdownField, type CountdownProps, type CountdownRef, fields } from './root';

export const Countdown = Object.assign(C, { fields });

export namespace Countdown {
	export type Props = CountdownProps;
	export type Ref = CountdownRef;
	export type Field = CountdownField;
}
