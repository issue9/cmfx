// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { type ButtonKind, buttonKinds } from '@components/button/common/types';
import {
	type ButtonAnchorProps,
	type ButtonNormalProps,
	type ButtonProps,
	type ButtonRef,
	Button as C,
	presetProps,
} from './root';

export const Button = Object.assign(C, { presetProps, kinds: buttonKinds });

export namespace Button {
	export type Kind = ButtonKind;
	export type Props = ButtonProps;
	export type Ref<A extends boolean = false, E = A extends false ? HTMLButtonElement : HTMLAnchorElement> = ButtonRef<
		A,
		E
	>;
	export type AnchorProps = ButtonAnchorProps;
	export type NormalProps = ButtonNormalProps;
}
