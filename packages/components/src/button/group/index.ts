// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { GroupButton as C, type GroupButtonProps, type GroupButtonRef, presetProps } from './root';

export const ButtonGroup = Object.assign(C, { presetProps });

export namespace ButtonGroup {
	export type Props = GroupButtonProps;
	export type Ref = GroupButtonRef;
}
