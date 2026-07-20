// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { type Component, type JSX, Match, mergeProps, Switch } from 'solid-js';

import type { Props as CommonProps } from '@illustrations/common';
import * as bro from './bro';
import * as undraw from './undraw';

export const galleries = ['bro', 'undraw'] as const;

export type Gallery = (typeof galleries)[number];

export interface Props extends CommonProps {
	/**
	 * 图片集
	 *
	 * @defaultValue 'amico'
	 *
	 * @remarks
	 * 可用值包含以下可用项：
	 * - `bro` 来自 [storyset](https://storyset.com/bro)，图片比较大，统一的尺寸；
	 * - `undraw` 来自 [undraw](https://undraw.co/illustrations)，图片比较小，尺寸不统一；
	 */
	gallery?: Gallery;
}

const presetProps: Props = { gallery: 'bro' } as const;

/**
 * 表示 401 错误的 SVG 插画组件
 */
export function Error401(props: Props): JSX.Element {
	return createSwitch(bro.Error401, undraw.Error401)(props);
}

/**
 * 表示 402 错误的 SVG 插画组件
 */
export function Error402(props: Props): JSX.Element {
	return createSwitch(bro.Error402, undraw.Error402)(props);
}

/**
 * 表示 403 错误的 SVG 插画组件
 */
export function Error403(props: Props): JSX.Element {
	return createSwitch(bro.Error403, undraw.Error403)(props);
}

/**
 * 表示 404 错误的 SVG 插画组件
 */
export function Error404(props: Props): JSX.Element {
	return createSwitch(bro.Error404, undraw.Error404)(props);
}

/**
 * 表示 429 错误的 SVG 插画组件
 */
export function Error429(props: Props): JSX.Element {
	return createSwitch(bro.Error429, undraw.Error429)(props);
}

/**
 * 表示 500 错误的 SVG 插画组件
 */
export function Error500(props: Props): JSX.Element {
	return createSwitch(bro.Error500, undraw.Error500)(props);
}

/**
 * 表示 503 错误的 SVG 插画组件
 */
export function Error503(props: Props): JSX.Element {
	return createSwitch(bro.Error503, undraw.Error503)(props);
}

/**
 * 表示 504 错误的 SVG 插画组件
 */
export function Error504(props: Props): JSX.Element {
	return createSwitch(bro.Error504, undraw.Error504)(props);
}

/**
 * 表示未知错误的 SVG 插画组件
 */
export function BUG(props: Props): JSX.Element {
	return createSwitch(bro.BUG, undraw.BUG)(props);
}

/**
 * 表示项目正在升级或是创建的 SVG 插画组件
 */
export function Building(props: Props): JSX.Element {
	return createSwitch(bro.Building, undraw.Building)(props);
}

/**
 * 表示没有内容的 SVG 插画组件
 */
export function Empty(props: Props): JSX.Element {
	return createSwitch(bro.Empty, undraw.Empty)(props);
}

/**
 * 表示登录的 SVG 插画组件
 */
export function Login(props: Props): JSX.Element {
	return createSwitch(bro.Login, undraw.Login)(props);
}

/**
 * 表示无网络的 SVG 插画组件
 */
export function Offline(props: Props): JSX.Element {
	return createSwitch(bro.Offline, undraw.Offline)(props);
}

function createSwitch(A: Component<CommonProps>, U: Component<CommonProps>): Component<Props> {
	return (props: Props): JSX.Element => {
		props = mergeProps(presetProps, props);
		return (
			<Switch>
				<Match when={props.gallery === 'bro'}>
					<A {...props} />
				</Match>
				<Match when={props.gallery === 'undraw'}>
					<U {...props} />
				</Match>
			</Switch>
		);
	};
}
