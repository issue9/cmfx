// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { GroupButton as C, presetProps } from './root';

export const ButtonGroup = Object.assign(C, { presetProps });

export namespace ButtonGroup {
	export type Props = import('./root').GroupButtonProps;
	export type Ref = import('./root').GroupButtonRef;
}
