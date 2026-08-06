// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import {
	ConfirmButton as C,
	type ConfirmButtonAnchorProps,
	type ConfirmButtonNormalProps,
	type ConfirmButtonProps,
	type ConfirmButtonRef,
} from './root';

export const ConfirmButton = C;

export namespace ConfirmButton {
	export type Props = ConfirmButtonProps;
	export type Ref = ConfirmButtonRef;
	export type AnchorProps = ConfirmButtonAnchorProps;
	export type NormalProps = ConfirmButtonNormalProps;
}
