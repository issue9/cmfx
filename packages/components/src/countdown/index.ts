// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Countdown as C, fields } from './root';

export const Countdown = Object.assign(C, { fields });

export namespace Countdown {
	export type Props = import('./root').CountdownProps;
	export type Ref = import('./root').CountdownRef;
	export type Field = import('./root').CountdownField;
}
