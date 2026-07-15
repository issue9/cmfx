// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { type JSX, Match, mergeProps, Switch } from 'solid-js';

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
	props = mergeProps(presetProps, props);
	return (
		<Switch>
			<Match when={props.gallery === 'amico'}>
				<amico.Error401 {...props} />
			</Match>
			<Match when={props.gallery === 'undraw'}>
				<undraw.Error401 {...props} />
			</Match>
		</Switch>
	);
}

export function Error402(props: Props): JSX.Element {
	props = mergeProps(presetProps, props);
	return (
		<Switch>
			<Match when={props.gallery === 'amico'}>
				<amico.Error402 {...props} />
			</Match>
			<Match when={props.gallery === 'undraw'}>
				<undraw.Error402 {...props} />
			</Match>
		</Switch>
	);
}

export function Error403(props: Props): JSX.Element {
	props = mergeProps(presetProps, props);
	return (
		<Switch>
			<Match when={props.gallery === 'amico'}>
				<amico.Error403 {...props} />
			</Match>
			<Match when={props.gallery === 'undraw'}>
				<undraw.Error403 {...props} />
			</Match>
		</Switch>
	);
}
