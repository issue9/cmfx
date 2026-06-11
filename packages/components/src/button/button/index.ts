// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { buttonKinds } from '@components/button/common/types';
import { Button as C, presetProps } from './root';

export const Button = Object.assign(C, { presetProps, kinds: buttonKinds });

export namespace Button {
	export type Kind = import('../common/types').ButtonKind;
	export type Props = import('./root').ButtonProps;
	export type Ref<
		A extends boolean = false,
		E = A extends false ? HTMLButtonElement : HTMLAnchorElement,
	> = import('./root').ButtonRef<A, E>;
	export type AnchorProps = import('./root').ButtonAnchorProps;
	export type NormalProps = import('./root').ButtonNormalProps;
}
