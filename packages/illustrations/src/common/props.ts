// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type BaseProps, type BaseRef, joinClass, type RefProps } from '@cmfx/components';

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

export function buildClass(props: Props): string | undefined {
	return joinClass(props.palette, styles.illustration, props.class);
}
