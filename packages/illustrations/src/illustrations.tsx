// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { type Component, type JSX, Match, mergeProps, Switch } from 'solid-js';

import type { Props as CommonProps } from '@illustrations/common';
import * as amico from './amico';
import * as undraw from './undraw';

export const galleries = ['amico', 'undraw'] as const;

export type Gallery = (typeof galleries)[number];

export interface Props extends CommonProps {
	/**
	 * 图片集
	 *
	 * @default 'amico'
	 */
	gallery?: Gallery;
}

const presetProps: Props = { gallery: 'amico' } as const;

export function Error401(props: Props): JSX.Element {
	return createSwitch(amico.Error401, undraw.Error401)(props);
}

export function Error402(props: Props): JSX.Element {
	return createSwitch(amico.Error402, undraw.Error402)(props);
}

export function Error403(props: Props): JSX.Element {
	return createSwitch(amico.Error403, undraw.Error403)(props);
}

export function Error404(props: Props): JSX.Element {
	return createSwitch(amico.Error404, undraw.Error404)(props);
}

export function Error429(props: Props): JSX.Element {
	return createSwitch(amico.Error429, undraw.Error429)(props);
}

export function Error500(props: Props): JSX.Element {
	return createSwitch(amico.Error500, undraw.Error500)(props);
}

export function Error503(props: Props): JSX.Element {
	return createSwitch(amico.Error503, undraw.Error503)(props);
}

export function Error504(props: Props): JSX.Element {
	return createSwitch(amico.Error504, undraw.Error504)(props);
}

export function BUG(props: Props): JSX.Element {
	return createSwitch(amico.BUG, undraw.BUG)(props);
}

export function Building(props: Props): JSX.Element {
	return createSwitch(amico.Building, undraw.Building)(props);
}

export function Empty(props: Props): JSX.Element {
	return createSwitch(amico.Empty, undraw.Empty)(props);
}

function createSwitch(A: Component<CommonProps>, U: Component<CommonProps>): Component<Props> {
	return (props: Props): JSX.Element => {
		props = mergeProps(presetProps, props);
		return (
			<Switch>
				<Match when={props.gallery === 'amico'}>
					<A {...props} />
				</Match>
				<Match when={props.gallery === 'undraw'}>
					<U {...props} />
				</Match>
			</Switch>
		);
	};
}
