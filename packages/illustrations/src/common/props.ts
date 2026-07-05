// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type BaseProps, type BaseRef, joinClass, type RefProps } from '@cmfx/components';
import type { JSX } from 'solid-js';

import styles from './style.module.css';

export type Ref = BaseRef<SVGSVGElement>;

export interface Props extends BaseProps, RefProps<Ref> {
	/**
	 * 组件内的提示文字
	 *
	 * @reactive
	 */
	text?: string;
}

export function buildSVGProps(props: Props): JSX.SvgSVGAttributes<SVGSVGElement> {
	return {
		xmlns: 'http://www.w3.org/2000/svg',
		viewBox: '0 0 500 500',
		class: joinClass(props.palette, styles.illustration, props.class),
		style: props.style,
		role: 'presentation',
		'aria-hidden': true,
		ref: el => props.ref?.({ root: () => el }),
	};
}
